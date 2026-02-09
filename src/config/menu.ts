import type { RouteRecordRaw } from 'vue-router'
import router from '@/router'

export interface AppMenuItem {
  key: string
  label: string
  path: string
}

export const generateAppMenus = (): AppMenuItem[] => {
  const menus: AppMenuItem[] = []

  router.getRoutes().forEach((route: RouteRecordRaw) => {
    if (route.meta && route.meta.label && route.name && route.path) {
      menus.push({
        key: String(route.name),
        label: String(route.meta.label),
        path: route.path,
      })
    }
  })

  return menus
}

export const appMenus: AppMenuItem[] = generateAppMenus()
