<template>
  <div class="portfolio">
    <el-card v-if="!unlocked" class="password-card">
      <div class="password-header">
        <div class="lock-icon">
          <el-icon size="48" color="#667eea">
            <Lock />
          </el-icon>
        </div>
        <h3>作品集已加密</h3>
        <p class="hint-text">{{ portfolioData.hint }}</p>
      </div>
      
      <div class="password-form">
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="unlock"
          show-password
          size="large"
        />
        <el-button 
          type="primary" 
          size="large"
          @click="unlock" 
          :loading="loading"
          class="unlock-btn"
        >
          <el-icon :size="18"><Unlock /></el-icon>
          解锁作品集
        </el-button>
        <el-alert 
          v-if="error" 
          type="error" 
          style="margin-top: 20px;"
          closable
          @close="error = false"
        >
          <span class="error-text">密码错误，请重试</span>
        </el-alert>
      </div>
    </el-card>

    <div v-else class="content">
      <div class="content-header">
        <h2 class="content-title">{{ decryptedData?.title }}</h2>
        <p class="content-desc">{{ decryptedData?.description }}</p>
      </div>

      <div class="project-grid">
        <el-card 
          v-for="project in decryptedData?.projects" 
          :key="project.id" 
          class="project-card"
        >
          <div class="project-icon">
            <el-icon size="32" color="#667eea">
              <Folder />
            </el-icon>
          </div>
          <h3 class="project-name">{{ project.name }}</h3>
          <span class="project-category">{{ project.category }}</span>
          <span class="project-year">{{ project.year }}</span>
          <p class="project-desc">{{ project.description }}</p>
        </el-card>
      </div>

      <div class="skills-section">
        <h3 class="section-title">
          <el-icon :size="20" color="#667eea"><Bell /></el-icon>
          专业技能
        </h3>
        <div class="skills-tags">
          <el-tag 
            v-for="skill in decryptedData?.skills" 
            :key="skill" 
            class="skill-tag"
          >
            {{ skill }}
          </el-tag>
        </div>
      </div>

      <div class="experience-section">
        <h3 class="section-title">
          <el-icon :size="20" color="#764ba2"><Briefcase /></el-icon>
          工作经历
        </h3>
        <div class="timeline">
          <div 
            v-for="(exp, index) in decryptedData?.experience" 
            :key="index" 
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>{{ exp.company }}</h4>
              <span class="timeline-role">{{ exp.role }}</span>
              <span class="timeline-period">{{ exp.period }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-button 
        type="default" 
        @click="lockAgain" 
        class="lock-btn"
      >
        <el-icon :size="18"><Lock /></el-icon>
        重新加密
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock, Unlock, Folder, Bell, Briefcase } from '@element-plus/icons-vue'
import { decrypt } from '@/utils/crypto'
import { portfolioData } from '@/data/portfolio'

const password = ref('')
const unlocked = ref(false)
const error = ref(false)
const loading = ref(false)
const decryptedData = ref(null)

function unlock() {
  loading.value = true
  setTimeout(() => {
    try {
      const data = decrypt(portfolioData.encryptedContent, password.value)
      decryptedData.value = data
      unlocked.value = true
      error.value = false
    } catch {
      error.value = true
    }
    loading.value = false
  }, 500)
}

function lockAgain() {
  unlocked.value = false
  password.value = ''
  decryptedData.value = null
}
</script>

<style scoped>
.portfolio {
  max-width: 900px;
  margin: 0 auto;
}

.password-card {
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 50px 40px;
  text-align: center;
}

.password-header {
  margin-bottom: 40px;
}

.lock-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.password-header h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.hint-text {
  color: #666;
  font-size: 0.95rem;
}

.password-form {
  max-width: 350px;
  margin: 0 auto;
}

.unlock-btn {
  width: 100%;
  margin-top: 25px !important;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.error-text {
  color: #f56c6c;
}

.content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.content-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.content-title {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-desc {
  font-size: 1.1rem;
  color: #666;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.project-card {
  background: #fafafa !important;
  border-radius: 16px !important;
  padding: 25px;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15) !important;
}

.project-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: white;
}

.project-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.project-category {
  display: inline-block;
  background: #e8f4fd;
  color: #409eff;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-right: 8px;
}

.project-year {
  display: inline-block;
  background: #fef3c7;
  color: #f59e0b;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.project-desc {
  color: #666;
  margin-top: 15px;
  font-size: 0.9rem;
  line-height: 1.6;
}

.section-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.skills-section {
  margin-bottom: 40px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
}

.experience-section {
  margin-bottom: 40px;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.timeline-item {
  position: relative;
  padding-bottom: 30px;
  padding-left: 30px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.timeline-content h4 {
  color: #333;
  margin-bottom: 5px;
}

.timeline-role {
  display: inline-block;
  background: #f0f5ff;
  color: #667eea;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-right: 10px;
}

.timeline-period {
  color: #999;
  font-size: 0.85rem;
}

.lock-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  padding: 12px 30px;
}
</style>
