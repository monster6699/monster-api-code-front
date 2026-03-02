<script setup lang="ts">
import { Menu, Button, Avatar, Dropdown, message } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue' // 引入 onMounted
import { generateAppMenus, type AppMenuItem } from '@/config/menu'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const appMenus = ref<AppMenuItem[]>([])
onMounted(() => {
  appMenus.value = generateAppMenus()
})

// 动态生成菜单
// const appMenus = computed(() => {
//   // 确保 userStore.loginUser 已经加载后再生成菜单
//   // computed 会响应 userStore.loginUser 的变化自动重新计算
//   return generateAppMenus()
// })

const selectedKeys = computed(() => {
  const current = appMenus.value.find((item) => item.path === route.path)
  return current ? [current.key] : []
})

const handleMenuClick = (info: MenuInfo) => {
  const target = appMenus.value.find((item) => item.key === info.key)
  if (target) {
    router.push(target.path).catch((err) => {
      console.error('Navigation failed', err)
      message.error('页面加载失败，请刷新重试')
    })
  }
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    message.success('退出成功')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
  } catch (e) {
    message.error((e as Error).message ?? '退出失败')
  }
}

const dropdownItems = computed(() => [
  {
    key: 'logout',
    label: '退出登录',
    onClick: handleLogout,
  },
])
</script>

<template>
  <div class="w-full flex items-center justify-between gap-4 max-w-6xl mx-auto">
    <div class="flex items-center gap-2 md:gap-3 pt-10px">
      <img
        src="@/assets/logo.svg"
        alt="编程导航"
        style="height: 50px; width: auto; object-fit: contain"
      />
    </div>
    <div v-if="appMenus.length > 1" class="flex flex-1 items-center justify-center">
      <Menu
        mode="horizontal"
        theme="light"
        :selected-keys="selectedKeys"
        :items="appMenus.map((item) => ({ key: item.key, label: item.label }))"
        class="border-none min-w-0 bg-transparent"
        @click="handleMenuClick"
      />
      <div class="md:hidden">
        <!-- 在移动端显示折叠菜单按钮或下拉菜单 -->
      </div>
    </div>

    <div class="flex items-center gap-2 md:gap-3">
      <Dropdown v-if="userStore.isLoggedIn" :trigger="['click']">
        <a class="ant-dropdown-link flex items-center gap-2" @click.prevent>
          <Avatar
            :src="
              userStore.loginUser?.userAvatar ||
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyD/account_avatar.png'
            "
            :alt="userStore.loginUser?.userName || '用户'"
          />
          <span style="padding-left: 12px" class="text-gray-700 md:inline">{{
            userStore.loginUser?.userName || '用户'
          }}</span>
        </a>
        <template #overlay>
          <Menu :items="dropdownItems" />
        </template>
      </Dropdown>
      <Button
        v-else
        type="primary"
        size="middle"
        @click="router.push({ path: '/login', query: { redirect: route.fullPath } })"
      >
        登录
      </Button>
    </div>
  </div>
</template>
