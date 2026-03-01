import router from '@/router'
import axios from 'axios'
import { useRoute } from 'vue-router'

// 与后端一致的业务状态码
export const ResponseCode = {
  SUCCESS: 0, // 成功
  PARAMS_ERROR: 40000, // 参数错误
  NOT_LOGIN_ERROR: 40100, // 未登录
  NO_AUTH_ERROR: 40101, // 无权限
  FORBIDDEN_ERROR: 40300, // 禁止访问
  NOT_FOUND_ERROR: 40400, // 未找到
  SYSTEM_ERROR: 50000, // 系统错误
  OPERATION_ERROR: 50001, // 操作错误
} as const

export type ResponseCodeType = (typeof ResponseCode)[keyof typeof ResponseCode]

/** 请求失败时 reject 的形态，便于页面根据 code 做分支 */
export interface RequestError extends Error {
  code?: number
  message: string
}

// 从 .env 读取，仅 VITE_ 开头的变量会注入到 import.meta.env
const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

const request = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : '/api',
  timeout: 5000, // 请求超时时间
  withCredentials: true, // 允许携带 Cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如需携带 token，可在此添加
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === ResponseCode.SUCCESS) {
      return response
    }
    const message = data.message ?? '请求失败'
    const err: RequestError = new Error(message) as RequestError
    err.code = data.code
    err.message = message
    console.log(response.config)
    switch (data.code) {
      case ResponseCode.NOT_LOGIN_ERROR: {
        // 如果当前已经在登录页或注册页，则不进行全页重定向，避免死循环
        const currentRoute = router.currentRoute.value

        if (!currentRoute.meta.requiresAuth) {
          break
        }
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search || '/',
        )
        window.location.href = `/login?redirect=${redirect}`
        break
      }
      case ResponseCode.NO_AUTH_ERROR:
      case ResponseCode.FORBIDDEN_ERROR:
        console.error('[无权限]', message)
        break
      case ResponseCode.PARAMS_ERROR:
      case ResponseCode.NOT_FOUND_ERROR:
      case ResponseCode.SYSTEM_ERROR:
      case ResponseCode.OPERATION_ERROR:
      default:
        console.error(`[${data.code}]`, message)
    }

    return Promise.reject(err)
  },
  (error) => {
    console.log(error)
    const err: RequestError = new Error('网络异常，请稍后重试') as RequestError
    err.code = -1

    if (error.response) {
      const { status, data } = error.response
      err.code = status
      err.message =
        (data && typeof data === 'object' && 'message' in data
          ? (data as { message: string }).message
          : null) ?? `请求失败 (${status})`
      console.error('API Error:', status, data)
    } else if (error.request) {
      err.message = '网络异常，请检查网络连接'
      console.error('Network Error:', error.message)
    } else {
      err.message = error.message ?? '请求异常'
      console.error('Error:', error.message)
    }

    return Promise.reject(err)
  },
)

export default request
