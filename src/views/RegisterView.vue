<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userRegister } from '@/api/userController'
import type { RequestError } from '@/utils/request'

const router = useRouter()
const route = useRoute()

const userAccount = ref('')
const userPassword = ref('')
const checkPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')

const redirect = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' ? r : '/login'
})

function validate(): string {
  const account = userAccount.value.trim()
  if (!account) return '请输入账号'
  if (account.length < 4) return '账号长度至少 4 个字符'
  if (!userPassword.value) return '请输入密码'
  if (userPassword.value.length < 6) return '密码长度至少 6 个字符'
  if (userPassword.value !== checkPassword.value) return '两次输入的密码不一致'
  return ''
}

async function handleRegister() {
  errorMsg.value = ''
  const err = validate()
  if (err) {
    errorMsg.value = err
    return
  }

  loading.value = true
  try {
    await userRegister({
      userAccount: userAccount.value.trim(),
      userPassword: userPassword.value,
      checkPassword: checkPassword.value,
    })
    await router.push(redirect.value)
  } catch (e: unknown) {
    const msg =
      e && typeof e === 'object' && 'message' in e
        ? String((e as RequestError).message)
        : '注册失败，请稍后重试'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push({ path: '/login', query: route.query })
}
</script>

<template>
  <div class="register-page">
    <div class="register-bg">
      <div class="register-bg-shape shape-1" />
      <div class="register-bg-shape shape-2" />
      <div class="register-bg-shape shape-3" />
    </div>

    <div class="register-card">
      <header class="register-header">
        <h1 class="register-title">创建账号</h1>
        <p class="register-subtitle">填写以下信息完成注册</p>
      </header>

      <form class="register-form" @submit.prevent="handleRegister">
        <div v-if="errorMsg" class="register-error" role="alert">
          {{ errorMsg }}
        </div>

        <div class="form-group">
          <label for="userAccount" class="form-label">账号</label>
          <input
            id="userAccount"
            v-model="userAccount"
            type="text"
            class="form-input"
            placeholder="请输入账号（至少 4 个字符）"
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
            placeholder="请输入密码（至少 6 个字符）"
            autocomplete="new-password"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="checkPassword" class="form-label">确认密码</label>
          <input
            id="checkPassword"
            v-model="checkPassword"
            type="password"
            class="form-input"
            placeholder="请再次输入密码"
            autocomplete="new-password"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="register-btn" :disabled="loading">
          <span v-if="loading" class="btn-loading" />
          <span v-else>注 册</span>
        </button>

        <p class="register-footer">
          已有账号？
          <button type="button" class="link-btn" @click="goLogin">去登录</button>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.register-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #faf9f7 0%, #f0ede8 50%, #e8e4dd 100%);
}

.register-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.register-bg .shape-1 {
  width: 400px;
  height: 400px;
  background: #d4c4a8;
  top: -120px;
  right: -80px;
}

.register-bg .shape-2 {
  width: 300px;
  height: 300px;
  background: #c9b896;
  bottom: -60px;
  left: -60px;
}

.register-bg .shape-3 {
  width: 200px;
  height: 200px;
  background: #e8dfd0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.register-card {
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

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #2c2c2c;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.register-subtitle {
  font-size: 0.9375rem;
  color: #6b6b6b;
  font-weight: 400;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.register-error {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 115, 85, 0.35);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
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

.register-footer {
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
