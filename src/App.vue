<template>
  <div id="app">
    <!-- 方案详情页全屏模式 -->
    <div v-if="isProjectDetail" class="project-detail-mode">
      <router-view />
    </div>

    <!-- 分享模式 -->
    <div v-else-if="isSharedMode" class="shared-mode">
      <router-view />
    </div>

    <!-- 正常模式 -->
    <div v-else class="normal-mode">
      <div v-if="!isOwner" class="login-overlay">
        <el-card class="login-card">
          <div class="login-header">
            <div class="login-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#333" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <h3>GitHub 登录</h3>
            <p>使用 GitHub 账号验证身份</p>
          </div>
          <div class="login-form">
            <el-button
              type="primary"
              size="large"
              @click="handleLogin"
              class="login-btn"
              :loading="isLoading"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              使用 GitHub 登录
            </el-button>
            <el-button
              v-if="isLocalhost"
              size="large"
              @click="handleSimulateLogin"
              class="simulate-btn"
            >
              <el-icon :size="18"><MagicStick /></el-icon>
              本地模拟登录（仅测试用）
            </el-button>
          </div>
          <div class="visitor-links">
            <p class="visitor-hint">如果您是访客：</p>
            <ul>
              <li>您收到的公司方案链接可以直接访问</li>
              <li>首页和公司方案列表可以浏览</li>
              <li>但无法查看个人作品集等受保护内容</li>
            </ul>
          </div>
        </el-card>
      </div>

      <el-container v-else>
        <el-header class="main-header">
          <div class="header-content">
            <div class="logo">
              <el-icon class="logo-icon" size="32">
                <component :is="User" />
              </el-icon>
              <span class="logo-text">个人作品集</span>
            </div>
            <nav class="nav-links">
              <router-link
                v-for="link in navLinks"
                :key="link.path"
                :to="link.path"
                class="nav-link"
                :class="{ active: currentPath === link.path }"
              >
                <el-icon :size="18"><component :is="link.icon" /></el-icon>
                <span>{{ link.name }}</span>
              </router-link>
            </nav>
            <div class="user-actions">
              <div class="user-info" v-if="githubUser">
                <img :src="githubUser.avatar_url" class="user-avatar" />
                <span class="user-name">{{ githubUser.login }}</span>
              </div>
              <el-button size="small" @click="handleLogout" circle>
                <el-icon :size="16"><SwitchButton /></el-icon>
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        <el-footer class="main-footer">
          <p>© 2024 个人作品集 · 保留所有权利</p>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, HomeFilled, Folder, Briefcase, SwitchButton, MagicStick } from '@element-plus/icons-vue'
import { useGithubAuth } from '@/utils/githubAuth'

const router = useRouter()
const route = useRoute()
const { isOwner, login, logout, checkAuth, githubUser, simulateLogin, isLoading } = useGithubAuth()

const isLocalhost = window.location.hostname === 'localhost'

const isSharedMode = computed(() => {
  return route.query.shared === 'true'
})

const isProjectDetail = computed(() => {
  return route.path.startsWith('/projects/company/') || route.path.startsWith('/projects/portfolio/')
})

const currentPath = computed(() => route.path)

const navLinks = computed(() => {
  return [
    { name: '首页', path: '/', icon: HomeFilled },
    { name: '公司方案', path: '/projects/company', icon: Briefcase },
    { name: '个人作品集', path: '/projects/portfolio', icon: Folder }
  ]
})

function handleLogin() {
  login()
}

function handleSimulateLogin() {
  simulateLogin()
}

function handleLogout() {
  logout()
  router.push('/')
}

onMounted(() => {
  checkAuth()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.project-detail-mode {
  min-height: 100vh;
  background: #000;
}

.shared-mode {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.normal-mode {
  min-height: 100vh;
}

.login-overlay {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 50px 40px;
  text-align: center;
  max-width: 450px;
  width: 100%;
  border-radius: 20px !important;
}

.login-header {
  margin-bottom: 40px;
}

.login-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-icon svg {
  width: 48px;
  height: 48px;
}

.login-header h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 0.95rem;
}

.login-form {
  max-width: 350px;
  margin: 0 auto;
}

.login-btn {
  width: 100%;
  margin-top: 25px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #24292e !important;
  border-color: #24292e !important;
  color: white !important;
  font-weight: 600;
  padding: 20px 30px !important;
  font-size: 1rem;
}

.login-btn:hover {
  background: #2f363d !important;
  border-color: #2f363d !important;
  transform: translateY(-2px);
}

.simulate-btn {
  width: 100%;
  margin-top: 15px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #f0f0f0 !important;
  border-color: #ddd !important;
  color: #666 !important;
}

.visitor-links {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
  text-align: left;
}

.visitor-hint {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.visitor-links ul {
  list-style: none;
  padding: 0;
  color: #666;
  font-size: 0.85rem;
}

.visitor-links li {
  padding: 5px 0;
  padding-left: 20px;
  position: relative;
}

.visitor-links li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
}

.main-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #667eea;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.main-content {
  max-width: 100%;
  padding: 40px 20px;
  min-height: calc(100vh - 140px);
}

.main-footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.el-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  padding: 10px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.el-button--default {
  border-radius: 25px;
  padding: 10px 30px;
  font-weight: 500;
}

.el-input__wrapper {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.el-input__wrapper:focus-within {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.el-alert {
  border-radius: 12px;
}
</style>
