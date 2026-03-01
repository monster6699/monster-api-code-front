import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'basic',
      component: () => import('../layouts/BasicLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
          meta: { label: '首页' },
        },
        {
          path: '/app',
          name: 'app',
          component: () => import('../views/admin/AppManager.vue'),
          meta: { label: '应用管理', requiresAuth: true, roles: ['admin'] },
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('@/views/admin/UserList.vue'),
          meta: { label: '用户管理', requiresAuth: true, roles: ['admin'] },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { label: '登录', requiresAuth: false, hidden: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { label: '注册', requiresAuth: false, hidden: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta?.requiresAuth || false
  if (!userStore.isLoggedIn) {
    await userStore.fetchLoginUser()
  }
  // 如果是登录或注册页，直接放行
  if (!requiresAuth) {
    next()
    return
  }

  // 判断路由是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 如果需要登录但未登录，则重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else {
    next()
  }
})

export default router
