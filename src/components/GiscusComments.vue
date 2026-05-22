<template>
  <div class="giscus-comments">
    <div class="comments-header">
      <h3 class="comments-title">
        <el-icon :size="20" color="#667eea"><ChatDotRound /></el-icon>
        评论
      </h3>
      <p class="comments-hint">使用 GitHub 账号登录后即可评论</p>
    </div>
    <div class="giscus-container" ref="giscusContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps({
  discussionId: {
    type: String,
    default: ''
  }
})

const giscusContainer = ref(null)

function loadGiscus() {
  if (!giscusContainer.value) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'XI-xi6767/XI-xi6767.github.io')
  script.setAttribute('data-repo-id', 'R_kgDOSkiSqA')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOSkiSqM4C9lok')
  script.setAttribute('data-mapping', 'specific')
  script.setAttribute('data-term', props.discussionId)
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  giscusContainer.value.appendChild(script)
}

function unloadGiscus() {
  if (giscusContainer.value) {
    giscusContainer.value.innerHTML = ''
  }
}

onMounted(() => {
  loadGiscus()
})

onUnmounted(() => {
  unloadGiscus()
})
</script>

<style scoped>
.giscus-comments {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 1px solid #eee;
}

.comments-header {
  margin-bottom: 25px;
}

.comments-title {
  font-size: 1.4rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comments-hint {
  color: #999;
  font-size: 0.9rem;
}

.giscus-container {
  min-height: 200px;
}

.giscus-container :deep(.giscus-frame) {
  border: none !important;
}
</style>
