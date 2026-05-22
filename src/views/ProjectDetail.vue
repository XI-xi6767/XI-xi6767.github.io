<template>
  <div class="project-detail">
    <div v-if="project" class="detail-content">
      <div v-if="!isSharedMode" class="back-btn" @click="$router.back()">
        <el-icon :size="20"><ArrowLeft /></el-icon>
        <span>返回列表</span>
      </div>

      <div v-if="isOwner && !isSharedMode" class="share-section">
        <el-button type="primary" @click="copyShareLink" class="share-btn">
          <el-icon :size="16"><Link /></el-icon>
          复制分享链接
        </el-button>
        <span class="share-hint">分享此链接给同事/领导，他们只能看到这个方案</span>
      </div>

      <div class="detail-header">
        <div class="header-icon">
          <el-icon size="56" color="white">
            <Box />
          </el-icon>
        </div>
        <h1 class="header-title">{{ project.name }}</h1>
        <p class="header-desc">{{ project.description }}</p>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">
            <el-icon size="24" color="#667eea"><Bell /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">客户公司</span>
            <span class="info-value">{{ project.client }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <el-icon size="24" color="#764ba2"><Calendar /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">项目日期</span>
            <span class="info-value">{{ project.date }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <el-icon size="24" color="#f093fb"><Camera /></el-icon>
          </div>
          <div class="info-content">
            <span class="info-label">行业类型</span>
            <span class="info-value">{{ project.industry }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          <el-icon :size="20" color="#667eea"><Clock /></el-icon>
          项目目标
        </h3>
        <ul class="objectives-list">
          <li v-for="(objective, index) in project.objectives" :key="index">
            <span class="bullet"></span>
            {{ objective }}
          </li>
        </ul>
      </div>

      <div class="section">
        <h3 class="section-title">
          <el-icon :size="20" color="#764ba2"><Coffee /></el-icon>
          解决方案
        </h3>
        <p class="solution-text">{{ project.solution }}</p>
      </div>

      <div class="section">
        <h3 class="section-title">
          <el-icon :size="20" color="#f093fb"><CreditCard /></el-icon>
          项目成果
        </h3>
        <div class="results-grid">
          <div
            v-for="(result, index) in project.results"
            :key="index"
            class="result-card"
          >
            <div class="result-value">{{ result.value }}</div>
            <div class="result-label">{{ result.label }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">
          <el-icon :size="20" color="#f5576c"><Apple /></el-icon>
          使用技术
        </h3>
        <div class="tech-tags">
          <el-tag
            v-for="tech in project.technologies"
            :key="tech"
            class="tech-tag"
          >
            {{ tech }}
          </el-tag>
        </div>
      </div>

      <GiscusComments :discussion-id="`project-${project?.id}`" />

      <div v-if="isSharedMode" class="shared-footer">
        <p>来自个人作品集 - 专业原型与交互方案</p>
      </div>
    </div>

    <div v-else class="not-found">
      <el-icon size="64" color="#ccc"><Bell /></el-icon>
      <p>方案不存在</p>
      <el-button @click="$router.push('/projects')">返回列表</el-button>
    </div>

    <el-dialog v-model="showShareSuccess" title="分享链接已复制" width="400px">
      <p style="text-align: center;">分享链接已复制到剪贴板</p>
      <p style="text-align: center; color: #666; font-size: 0.9rem; margin-top: 10px;">
        对方访问此链接后，只能看到这个方案，看不到其他内容
      </p>
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
  Calendar,
  Camera,
  Clock,
  Coffee,
  CreditCard,
  Apple,
  Link
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { projectsList } from '@/data/projects'
import { useGithubAuth } from '@/utils/githubAuth'
import GiscusComments from '@/components/GiscusComments.vue'

const route = useRoute()
const { isOwner } = useGithubAuth()

const project = ref(null)
const showShareSuccess = ref(false)

const isSharedMode = computed(() => {
  return route.query.shared === 'true'
})

function copyShareLink() {
  const baseUrl = window.location.origin + window.location.pathname
  const shareUrl = `${baseUrl}?shared=true&id=${project.value.id}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    showShareSuccess.value = true
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

onMounted(() => {
  let id = route.query.id ? parseInt(route.query.id) : parseInt(route.params.id)

  if (!id || isNaN(id)) {
    id = parseInt(route.path.split('/').pop())
  }

  project.value = projectsList.find(p => p.id === id)
})
</script>

<style scoped>
.project-detail {
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: white;
  gap: 12px;
}

.share-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-hint {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.detail-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.detail-header {
  text-align: center;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.header-icon {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.header-title {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-desc {
  font-size: 1.1rem;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.objectives-list {
  list-style: none;
  padding: 0;
}

.objectives-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.objectives-list li:last-child {
  border-bottom: none;
}

.bullet {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-top: 6px;
  flex-shrink: 0;
}

.objectives-list li span:last-child {
  color: #555;
  line-height: 1.6;
}

.solution-text {
  color: #555;
  line-height: 1.8;
  font-size: 1rem;
  background: #f8f9fa;
  padding: 25px;
  border-radius: 16px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  color: white;
}

.result-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.result-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-tag {
  background: #f0f5ff;
  color: #667eea;
  border: 1px solid #e6f0ff;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
}

.shared-footer {
  text-align: center;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 0.9rem;
}

.not-found {
  text-align: center;
  padding: 60px;
}

.not-found p {
  color: rgba(255, 255, 255, 0.7);
  margin: 20px 0;
}

@media (max-width: 768px) {
  .detail-content {
    padding: 25px;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .share-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
