<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userAccount = ref('')
const userPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')

const redirect = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' ? r : '/'
})

async function handleLogin() {
  errorMsg.value = ''
  if (!userAccount.value.trim()) {
    errorMsg.value = '请输入账号'
    return
  }
  if (!userPassword.value) {
    errorMsg.value = '请输入密码'
    return
  }

  loading.value = true
  try {
    await userStore.login(userAccount.value.trim(), userPassword.value)
    await router.push(redirect.value)
  } catch (e: unknown) {
    const msg =
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message: unknown }).message)
        : '登录失败，请检查账号密码'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push({ path: '/register', query: route.query })
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-bg-shape shape-1" />
      <div class="login-bg-shape shape-2" />
      <div class="login-bg-shape shape-3" />
    </div>

    <div class="login-card">
      <header class="login-header">
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">登录您的账号以继续</p>
      </header>

      <form class="login-form" @submit.prevent="handleLogin">
        <div v-if="errorMsg" class="login-error" role="alert">
          {{ errorMsg }}
        </div>

        <div class="form-group">
          <label for="userAccount" class="form-label">账号</label>
          <input
            id="userAccount"
            v-model="userAccount"
            type="text"
            class="form-input"
            placeholder="请输入账号"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="userPassword" class="form-label">密码</label>
          <input
            id="userPassword"
            v-model="userPassword"
            type="password"
            class="form-input"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="btn-loading" />
          <span v-else>登 录</span>
        </button>

        <p class="login-footer">
          还没有账号？
          <button type="button" class="link-btn" @click="goRegister">去注册</button>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #faf9f7 0%, #f0ede8 50%, #e8e4dd 100%);
}

.login-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.login-bg .shape-1 {
  width: 400px;
  height: 400px;
  background: #d4c4a8;
  top: -120px;
  right: -80px;
}

.login-bg .shape-2 {
  width: 300px;
  height: 300px;
  background: #c9b896;
  bottom: -60px;
  left: -60px;
}

.login-bg .shape-3 {
  width: 200px;
  height: 200px;
  background: #e8dfd0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  padding: 2.5rem 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c2c2c;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.login-subtitle {
  font-size: 0.9375rem;
  color: #6b6b6b;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-error {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
  border-radius: 10px;
  border: 1px solid #fecaca;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  color: #1f2937;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:hover:not(:disabled) {
  border-color: #d1d5db;
}

.form-input:focus {
  outline: none;
  border-color: #c9b896;
  box-shadow: 0 0 0 3px rgba(201, 184, 150, 0.25);
}

.form-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn {
  margin-top: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #a8926e 0%, #8b7355 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.2s;
  position: relative;
  min-height: 48px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 115, 85, 0.35);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.btn-loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.link-btn {
  background: none;
  border: none;
  color: #8b7355;
  font-weight: 600;
  cursor: pointer;
  padding: 0 0.25rem;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.link-btn:hover {
  color: #6b5a45;
}
</style>
