<script setup lang="ts">
import { Layout } from 'ant-design-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { RouterView } from 'vue-router'

const { Header, Content, Footer } = Layout
</script>

<template>
  <Layout class="min-h-screen bg-slate-50 flex flex-col">
    <Header
      class="px-4 md:px-8 flex items-center shadow-sm flex-shrink-0"
      :style="{ background: '#ffffff' }"
    >
      <GlobalHeader />
    </Header>

    <Content class="px-4 md:px-8 py-6 flex-1">
      <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-4 md:p-8 min-h-[60vh]">
        <RouterView />
      </div>
    </Content>

    <Footer class="px-4 md:px-8 py-4 bg-white border-t flex-shrink-0">
      <GlobalFooter />
    </Footer>
  </Layout>
</template>
