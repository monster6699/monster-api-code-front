<script setup lang="ts">
import { Menu, Button } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { appMenus } from '@/config/menu'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'

const router = useRouter()
const route = useRoute()

const selectedKeys = computed(() => {
  const current = appMenus.find((item) => item.path === route.path)
  return current ? [current.key] : []
})

const handleMenuClick = (info: MenuInfo) => {
  const target = appMenus.find((item) => item.key === info.key)
  if (target) {
    router.push(target.path)
  }
}
</script>

<template>
  <div class="w-full flex items-center justify-between gap-4 max-w-6xl mx-auto">
    <div class="flex items-center gap-2 md:gap-3">
      <img
        src="@/assets/logo.svg"
        alt="编程导航"
        class="h-6 w-6 md:h-7 md:w-7"
        style="width: 24px; height: 24px; object-fit: contain"
      />
      <span class="text-base md:text-lg font-semibold whitespace-nowrap text-gray-900">
        Monster API
      </span>
    </div>

    <div class="flex flex-1 items-center justify-center">
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
      <Button type="primary" size="middle"> 登录 </Button>
    </div>
  </div>
</template>
