import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
export interface AppMenuItem {
  key: string
  label: string
  path: string
}

export const generateAppMenus = (): AppMenuItem[] => {
  const menus: AppMenuItem[] = []
  const useRole = userStore.loginUser?.userRole
  router.getRoutes().forEach((route: RouteRecordRaw) => {
    if (route.meta && route.meta.label && route.name && route.path) {
      const roles = Array.isArray(route.meta.roles) ? route.meta.roles : []
      const hidden = route.meta.hidden || false
      const isAuth = roles.length > 0 && useRole ? roles.includes(useRole) : false
      const enable = route.meta.roles ? isAuth : !hidden
      if (enable) {
        menus.push({
          key: String(route.name),
          label: String(route.meta.label),
          path: route.path,
        })
      }
    }
  })

  return menus
}

// export const appMenus: AppMenuItem[] = generateAppMenus()
