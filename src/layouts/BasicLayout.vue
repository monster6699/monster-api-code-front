<script setup lang="ts">
import { Layout } from 'ant-design-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import { RouterView } from 'vue-router'

const { Header, Content } = Layout
</script>

<template>
  <Layout class="app-layout">
    <Header class="app-header">
      <GlobalHeader />
    </Header>

    <Content class="app-content">
      <div class="content-wrapper">
        <RouterView />
      </div>
    </Content>
  </Layout>
</template>

<style scoped>
.app-layout {
  height: 100%;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  height: auto !important;
  line-height: normal;
  position: sticky;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 0;
  z-index: 100;
}

.app-content {
  flex: 1;
  padding: 24px;
  background: transparent;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 1200px;
  overflow: hidden;
  margin: 0 auto 80px;
}

.app-footer {
  background: #fff !important;
  border-top: 1px solid #e2e8f0;
  padding: 24px !important;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

@media (max-width: 768px) {
  .app-content {
    padding: 16px;
  }
}
</style>
