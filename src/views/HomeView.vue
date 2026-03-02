<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { listMyAppsByPage, listFeaturedAppsByPage } from '@/api/appController'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 我的应用分页
const myAppQuery = reactive({
  pageNum: 1,
  pageSize: 8,
})
const myApps = ref<API.AppVO[]>([])
const myAppsTotal = ref(0)
const myAppsLoading = ref(false)

// 精选应用分页
const featuredQuery = reactive({
  pageNum: 1,
  pageSize: 8,
})
const featuredApps = ref<API.AppVO[]>([])
const featuredTotal = ref(0)
const featuredLoading = ref(false)

// 用户输入的提示词
const userPrompt = ref('')
const isGenerating = ref(false)

// 控制底部大容器的显示动画
const showContent = ref(false)

// 判断应用是否已部署
const isDeployed = (app: API.AppVO): boolean => {
  return !!app.deployKey && !!app.deployedTime
}

// 加载我的应用
const fetchMyApps = async () => {
  if (!userStore.isLoggedIn) {
    myApps.value = []
    myAppsTotal.value = 0
    return
  }
  myAppsLoading.value = true
  try {
    const res = await listMyAppsByPage({
      pageNum: myAppQuery.pageNum,
      pageSize: myAppQuery.pageSize,
    })
    myApps.value = res.data?.data?.records ?? []
    myAppsTotal.value = res.data?.data?.totalRow ?? 0
  } catch {
    message.error('加载我的应用失败')
  } finally {
    myAppsLoading.value = false
  }
}

// 加载精选应用
const fetchFeaturedApps = async () => {
  featuredLoading.value = true
  try {
    const res = await listFeaturedAppsByPage({
      pageNum: featuredQuery.pageNum,
      pageSize: featuredQuery.pageSize,
    })
    featuredApps.value = res.data?.data?.records ?? []
    featuredTotal.value = res.data?.data?.totalRow ?? 0
  } catch {
    message.error('加载精选应用失败')
  } finally {
    featuredLoading.value = false
  }
}

// 处理生成
const handleGenerate = () => {
  if (!userPrompt.value.trim()) {
    message.warning('请输入您的想法')
    return
  }
  if (!userStore.isLoggedIn) {
    message.info('请先登录')
    router.push({ path: '/login', query: { redirect: '/home' } })
    return
  }
  message.info('功能开发中...')
}

// 跳转到应用详情/对话页面
const goToAppChat = (app: API.AppVO) => {
  router.push({ path: '/app/chat', query: { id: app.id } })
}

// 跳转到已部署的网站
const goToDeployedSite = (app: API.AppVO) => {
  if (app.deployKey) {
    window.open(`https://${app.deployKey}.yumaocrm.com`, '_blank')
  }
}

// 跳转到精选应用预览
const goToPreview = (app: API.AppVO) => {
  router.push({ path: '/app/preview', query: { id: app.id } })
}

// 分页变化
const onMyAppsPageChange = (page: number) => {
  myAppQuery.pageNum = page
  fetchMyApps()
}

const onFeaturedPageChange = (page: number) => {
  featuredQuery.pageNum = page
  fetchFeaturedApps()
}

onMounted(async () => {
  // 并行请求接口，等待都返回后触发动画
  await Promise.all([fetchMyApps(), fetchFeaturedApps()])

  // 增加微小的延迟让浏览器渲染更顺滑
  setTimeout(() => {
    showContent.value = true
  }, 100)
})
</script>

<template>
  <div class="home-page">
    <div class="page-global-bg"></div>

    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">所想 <span class="highlight-icon">✨</span> 化作所见</h1>
        <p class="hero-subtitle">与 AI 对话轻松创建应用和网站</p>

        <div class="prompt-wrapper">
          <div class="prompt-box">
            <textarea
              v-model="userPrompt"
              class="prompt-input"
              placeholder="描述你想要的应用，比如：帮我生成一个极简风格的个人博客网站..."
              rows="2"
              @keydown.ctrl.enter="handleGenerate"
            ></textarea>

            <div class="prompt-actions">
              <div class="prompt-tools">
                <button class="tool-btn">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  上传素材
                </button>
              </div>
              <button
                class="generate-btn"
                :class="{ loading: isGenerating }"
                :disabled="isGenerating"
                @click="handleGenerate"
              >
                <svg
                  v-if="!isGenerating"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-else class="loading-spinner"></span>
              </button>
            </div>
          </div>
          <div class="prompt-tags">
            <span class="tag">波普风电商页面</span>
            <span class="tag">企业网站</span>
            <span class="tag">电商运营后台</span>
            <span class="tag">暗黑话题社区</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="content-container" :class="{ 'is-visible': showContent }">
        <div class="apps-section">
          <div class="section-header">
            <h2 class="section-title">我的作品</h2>
          </div>
          <div class="apps-grid">
            <template v-if="myAppsLoading">
              <div v-for="i in 4" :key="`skeleton-my-${i}`" class="app-card skeleton-card">
                <div class="skeleton-cover"></div>
                <div class="skeleton-info">
                  <div class="skeleton-line title"></div>
                  <div class="skeleton-line desc"></div>
                  <div class="skeleton-line short"></div>
                </div>
              </div>
            </template>

            <template v-else>
              <div v-for="app in myApps" :key="app.id" class="app-card">
                <div
                  class="app-cover"
                  @click="isDeployed(app) ? goToDeployedSite(app) : goToAppChat(app)"
                >
                  <img v-if="app.cover" :src="app.cover" :alt="app.appName" />
                  <div v-else class="cover-placeholder">
                    <span>{{ app.appName?.charAt(0) || '?' }}</span>
                  </div>
                  <div class="app-overlay">
                    <span class="overlay-btn">
                      {{ isDeployed(app) ? '访问网站 ↗' : '继续开发 →' }}
                    </span>
                  </div>
                </div>
                <div class="app-info">
                  <h3 class="app-name">{{ app.appName }}</h3>
                  <p class="app-desc">{{ app.initPrompt || '暂无描述' }}</p>
                  <div class="app-footer">
                    <span v-if="isDeployed(app)" class="status-tag deployed">已部署</span>
                    <span v-else class="status-tag draft">开发中</span>
                    <span class="create-time">{{ app.createTime?.slice(0, 10) }}</span>
                  </div>
                </div>
              </div>
            </template>

            <div v-if="myApps.length === 0 && !myAppsLoading" class="empty-card">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 4.5v15m7.5-7.5h-15" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <p>暂无作品，在上方输入灵感开始创建</p>
            </div>
          </div>

          <div v-if="myAppsTotal > myAppQuery.pageSize" class="pagination">
            <a-pagination
              :current="myAppQuery.pageNum"
              :total="myAppsTotal"
              :page-size="myAppQuery.pageSize"
              @change="onMyAppsPageChange"
            />
          </div>
        </div>

        <div class="apps-section">
          <div class="section-header">
            <h2 class="section-title">精选案例</h2>
          </div>
          <div class="apps-grid">
            <template v-if="featuredLoading">
              <div v-for="i in 4" :key="`skeleton-feat-${i}`" class="app-card skeleton-card">
                <div class="skeleton-cover"></div>
                <div class="skeleton-info">
                  <div class="skeleton-line title"></div>
                  <div class="skeleton-line desc"></div>
                  <div class="skeleton-line short"></div>
                </div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="app in featuredApps"
                :key="app.id"
                class="app-card"
                @click="goToPreview(app)"
              >
                <div class="app-cover">
                  <img v-if="app.cover" :src="app.cover" :alt="app.appName" />
                  <div v-else class="cover-placeholder">
                    <span>{{ app.appName?.charAt(0) || '?' }}</span>
                  </div>
                  <div class="app-overlay">
                    <span class="overlay-btn">预览应用</span>
                  </div>
                </div>
                <div class="app-info">
                  <h3 class="app-name">{{ app.appName }}</h3>
                  <p class="app-desc">{{ app.initPrompt || '暂无描述' }}</p>
                  <div class="app-footer">
                    <span class="creator">
                      <span class="avatar">{{ (app.user?.userName || '匿').charAt(0) }}</span>
                      {{ app.user?.userName || '匿名用户' }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <div v-if="featuredApps.length === 0 && !featuredLoading" class="empty-card">
              <p>暂无精选案例</p>
            </div>
          </div>

          <div v-if="featuredTotal > featuredQuery.pageSize" class="pagination">
            <a-pagination
              :current="featuredQuery.pageNum"
              :total="featuredTotal"
              :page-size="featuredQuery.pageSize"
              @change="onFeaturedPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  height: 100%;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
}

/* 全局渐变背景，类似截图的清新渐变 */
.page-global-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(120deg, #e0ffff 0%, #e6f7ff 30%, #f0f5ff 70%, #dbeafe 100%);
}

/* Hero 区域：无需白底，完全融入背景 */
.hero-section {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.highlight-icon {
  display: inline-flex;
  background: #0f172a;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.hero-subtitle {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
  font-weight: 500;
}

/* 输入框区域重构为截图样式 */
.prompt-wrapper {
  max-width: 760px;
  margin: 0 auto;
}

.prompt-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: box-shadow 0.3s ease;
}

.prompt-box:focus-within {
  box-shadow:
    0 10px 40px rgba(99, 102, 241, 0.12),
    0 0 0 2px rgba(99, 102, 241, 0.1);
}

.prompt-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  min-height: 60px;
  font-family: inherit;
}

.prompt-input::placeholder {
  color: #94a3b8;
}

.prompt-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prompt-tools {
  display: flex;
  gap: 12px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f1f5f9;
  border: none;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.generate-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #94a3b8; /* 默认置灰，可根据需求改为高亮色 #0f172a */
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 底部 Tag 标签 */
.prompt-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 核心动画：大容器容器上浮 */
.content-wrapper {
  padding: 0 24px; /* 页面两侧留白 */
  max-width: 1440px;
  margin: 0 auto;
}

.content-container {
  background: #ffffff;
  border-radius: 32px 32px 0 0; /* 仅顶部有大圆角 */
  padding: 48px 40px;
  min-height: 60vh;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.04);

  /* 初始状态隐藏并下移 */
  opacity: 0;
  transform: translateY(80px);
  /* 设置极其平滑的过渡动画 */
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 触发动画的 class */
.content-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 应用列表区域 */
.apps-section {
  margin-bottom: 60px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* 骨架屏动画 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #f1f5f9;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background-color: #f1f5f9;
  border-radius: 4px;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeleton-line.title {
  width: 60%;
  height: 20px;
  margin-bottom: 4px;
}
.skeleton-line.desc {
  width: 100%;
  height: 32px;
}
.skeleton-line.short {
  width: 40%;
  margin-top: auto;
}

/* 正常卡片样式 */
.app-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
}

.app-card:hover {
  border-color: #e2e8f0;
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
}

.app-cover {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #f8fafc;
  overflow: hidden;
  border-bottom: 1px solid #f1f5f9;
}

.app-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.cover-placeholder span {
  font-size: 56px;
  font-weight: 700;
  color: #cbd5e1;
}

.app-card:hover .app-cover img {
  transform: scale(1.03);
}

.app-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.app-card:hover .app-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 10px 24px;
  background: #ffffff;
  color: #0f172a;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.app-card:hover .overlay-btn {
  transform: translateY(0);
}

.app-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.app-name {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 42px;
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  margin-top: auto;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.status-tag.deployed {
  background: #dcfce7;
  color: #166534;
}

.status-tag.draft {
  background: #f1f5f9;
  color: #475569;
}

.creator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-weight: 500;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.empty-card {
  grid-column: 1 / -1;
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  padding: 64px 20px;
  text-align: center;
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  color: #cbd5e1;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 28px;
  height: 28px;
}

.empty-card p {
  color: #64748b;
  font-size: 14px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.pagination :deep(.ant-pagination-item) {
  background: transparent;
  border-color: transparent;
  border-radius: 8px;
}

.pagination :deep(.ant-pagination-item a) {
  color: #64748b;
  font-weight: 500;
}

.pagination :deep(.ant-pagination-item:hover) {
  background: #f1f5f9;
}

.pagination :deep(.ant-pagination-item-active) {
  background: #0f172a;
  border-color: #0f172a;
}

.pagination :deep(.ant-pagination-item-active a) {
  color: #fff;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .content-wrapper {
    padding: 0;
  }

  .content-container {
    border-radius: 24px 24px 0 0;
    padding: 32px 20px;
  }
}
</style>
