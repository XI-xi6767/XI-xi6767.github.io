<template>
  <div class="project-detail" :class="{ 'fullscreen-mode': isFullscreen || isSharedMode }">
    <!-- 全屏模式 - 只显示 iframe -->
    <div v-if="project && (isFullscreen || isSharedMode)" class="fullscreen-content">
      <div 
        v-if="!isSharedMode" 
        class="fullscreen-exit" 
        :class="{ 'hidden': !showControls }"
        @click="toggleFullscreen"
        @mouseenter="showControls = true"
        @mouseleave="hideControlsWithDelay"
      >
        <el-icon :size="20"><ArrowLeft /></el-icon>
        <span>退出全屏</span>
      </div>
      
      <!-- 显示/隐藏控制栏的触发区域 -->
      <div 
        v-if="!isSharedMode" 
        class="control-trigger"
        @mouseenter="showControls = true"
      ></div>
      
      <iframe 
        :src="project.path" 
        :title="project.title"
        class="fullscreen-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>

    <!-- 正常模式 -->
    <div v-else-if="project" class="detail-content">
      <!-- 顶部控制栏 -->
      <div 
        class="top-bar"
        :class="{ 'hidden': !showControls }"
        @mouseenter="showControls = true"
        @mouseleave="hideControlsWithDelay"
      >
        <!-- 左上角：返回 + 方案信息 -->
        <div class="top-left">
          <div class="back-btn" @click.stop="$router.back()">
            <el-icon :size="18"><ArrowLeft /></el-icon>
            <span>返回</span>
          </div>
          <div class="divider"></div>
          <div class="project-info">
            <div class="info-thumbnail" v-if="project.thumbnail">
              <img :src="project.thumbnail" :alt="project.title" />
            </div>
            <div class="info-thumbnail" v-else>
              <el-icon size="18" color="white"><Box /></el-icon>
            </div>
            <div class="info-text">
              <h3 class="info-title">{{ project.title }}</h3>
              <p class="info-desc">{{ project.description }}</p>
            </div>
          </div>
        </div>

        <!-- 右上角：操作按钮 -->
        <div v-if="isOwner" class="top-right">
          <div class="action-btn share-btn" @click.stop="copyShareLink">
            <el-icon :size="16"><Link /></el-icon>
            <span>分享链接</span>
          </div>
          <div class="action-btn fullscreen-btn" @click.stop="toggleFullscreen">
            <el-icon :size="16"><FullScreen /></el-icon>
            <span>全屏预览</span>
          </div>
        </div>
      </div>

      <!-- 显示/隐藏控制栏的触发区域 -->
      <div 
        class="control-trigger"
        @mouseenter="showControls = true"
      ></div>

      <div class="iframe-container">
        <iframe 
          :src="project.path" 
          :title="project.title"
          class="project-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
      </div>

      <div class="comments-section">
        <GiscusComments :discussion-id="`project-${project?.id}`" />
      </div>
    </div>

    <div v-else class="not-found">
      <div class="not-found-content">
        <el-icon size="80" color="rgba(255,255,255,0.3)"><Bell /></el-icon>
        <h2>方案不存在</h2>
        <p>这个方案可能已被删除或链接有误</p>
        <el-button type="primary" size="large" @click="$router.push('/projects')">
          <el-icon><ArrowLeft /></el-icon>
          返回方案列表
        </el-button>
      </div>
    </div>

    <el-dialog v-model="showShareSuccess" title="分享链接已复制" width="420px" center>
      <div class="share-success-content">
        <div class="success-icon">
          <el-icon :size="48" color="#67c23a"><CircleCheck /></el-icon>
        </div>
        <p>分享链接已复制到剪贴板</p>
        <p class="success-hint">对方访问此链接后，直接打开全屏方案，没有其他干扰</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="showShareSuccess = false">好的</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  Box,
  Bell,
  Link,
  FullScreen,
  CircleCheck
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { loadProjects, getProjectByPath } from '@/data/projects'
import { useGithubAuth } from '@/utils/githubAuth'
import GiscusComments from '@/components/GiscusComments.vue'

const route = useRoute()
const { isOwner } = useGithubAuth()

const project = ref(null)
const showShareSuccess = ref(false)
const isFullscreen = ref(false)
const showControls = ref(true)
let hideTimer = null

const isSharedMode = computed(() => {
  return route.query.shared === 'true'
})

const hideControlsWithDelay = () => {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    showControls.value = false
  }, 1500)
}

function copyShareLink() {
  const baseUrl = window.location.origin + window.location.pathname
  const shareUrl = `${baseUrl}?shared=true`
  navigator.clipboard.writeText(shareUrl).then(() => {
    showShareSuccess.value = true
    setTimeout(() => {
      showShareSuccess.value = false
    }, 2000)
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

onMounted(async () => {
  await loadProjects()
  
  // 构建项目路径
  const category = route.params.category
  const pathMatch = route.params.pathMatch || []
  // 将路径匹配转换为完整的路径
  const projectPath = `/projects/${category}/${Array.isArray(pathMatch) ? pathMatch.join('/') : pathMatch}`
  
  // 通过路径查找项目
  project.value = getProjectByPath(projectPath, category)
  
  // 页面加载后自动隐藏控制栏
  setTimeout(() => {
    showControls.value = false
  }, 2000)
})
</script>

<style scoped>
/* 全屏模式 */
.project-detail.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  margin: 0;
  z-index: 9999;
  background: #000;
}

.fullscreen-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.fullscreen-exit {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  opacity: 1;
  transform: translateY(0);
}

.fullscreen-exit.hidden {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}

.fullscreen-exit:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.fullscreen-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 正常模式（项目详情页现在也是全屏） */
.project-detail {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background: #0a0a0a;
}

.detail-content {
  width: 100%;
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  position: relative;
}

/* 顶部控制栏 */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
}

.top-bar.hidden {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

/* 控制栏触发区域 */
.control-trigger {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 9998;
  background: transparent;
}

.detail-content .control-trigger {
  position: fixed;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.info-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-title {
  font-size: 1rem;
  color: white;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.info-desc {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.3;
}

.top-right {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.fullscreen-btn {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.fullscreen-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-color: rgba(102, 126, 234, 0.4);
}

.iframe-container {
  width: 100%;
  height: 100vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  background: #000;
}

.project-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.comments-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 24px;
}

.not-found {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  padding: 60px 40px;
}

.not-found-content h2 {
  color: white;
  font-size: 1.8rem;
  margin: 20px 0 10px;
  font-weight: 600;
}

.not-found-content p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 30px;
  font-size: 1rem;
}

.share-success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  margin-bottom: 20px;
  animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.share-success-content p {
  margin: 8px 0;
  color: #333;
  font-size: 1rem;
}

.success-hint {
  color: #999 !important;
  font-size: 0.9rem !important;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 12px 16px;
  }

  .info-desc {
    display: none;
  }

  .back-btn span,
  .share-btn span,
  .fullscreen-btn span {
    display: none;
  }

  .action-btn {
    padding: 10px 14px;
  }

  .back-btn {
    padding: 10px 12px;
  }

  .divider {
    height: 28px;
  }

  .info-thumbnail {
    width: 36px;
    height: 36px;
  }
}
</style>
