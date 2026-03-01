import { defineStore } from 'pinia'
import { getLoginUser, userLogin, userLogout } from '@/api/userController'
import type { RequestError } from '@/utils/request'

interface UserState {
  loginUser: API.LoginUserVO | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    loginUser: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.loginUser?.id,
  },
  actions: {
    async fetchLoginUser() {
      try {
        const res = await getLoginUser()
        this.loginUser = res.data.data ?? null
      } catch (e) {
        // 忽略未登录错误，其他错误则抛出
        const error = e as RequestError
        if (error.code !== 40100) {
          console.error('获取登录用户失败', error)
          throw e
        }
        this.loginUser = null
      }
    },

    async login(userAccount: string, userPassword: string) {
      try {
        const { data } = await userLogin({ userAccount, userPassword })
        this.loginUser = data.data ?? null
        return true
      } catch (e) {
        console.error('登录失败', e)
        this.loginUser = null
        throw e
      }
    },

    async logout() {
      try {
        await userLogout()
        this.loginUser = null
      } catch (e) {
        console.error('登出失败', e)
        throw e
      }
    },
  },
})
