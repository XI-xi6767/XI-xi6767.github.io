<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <div class="avatar-wrapper">
          <div class="avatar">
            <el-icon class="avatar-icon" size="48">
              <User />
            </el-icon>
          </div>
          <div class="avatar-glow"></div>
        </div>
        <h1 class="hero-title">欢迎来到我的个人作品集</h1>
        <p class="hero-subtitle">探索我的项目和创意，解锁更多精彩内容</p>
        <div class="hero-actions">
          <el-button
            type="primary"
            size="large"
            @click="$router.push('/portfolio')"
            class="action-btn primary-btn"
          >
            <el-icon :size="20"><Folder /></el-icon>
            查看作品集
          </el-button>
          <el-button
            size="large"
            @click="$router.push('/projects')"
            class="action-btn secondary-btn"
          >
            <el-icon :size="20"><Briefcase /></el-icon>
            浏览方案
          </el-button>
        </div>
      </div>

      <div class="feature-cards">
        <el-card class="feature-card">
          <div class="feature-icon">
            <el-icon size="32" color="#667eea">
              <Box />
            </el-icon>
          </div>
          <h3>专业技能</h3>
          <p>精通前端开发、UI设计、数据分析等多项技能</p>
        </el-card>

        <el-card class="feature-card">
          <div class="feature-icon">
            <el-icon size="32" color="#764ba2">
              <Bell />
            </el-icon>
          </div>
          <h3>项目经验</h3>
          <p>参与多个大型项目开发，积累丰富实战经验</p>
        </el-card>

        <el-card class="feature-card">
          <div class="feature-icon">
            <el-icon size="32" color="#f093fb">
              <Star />
            </el-icon>
          </div>
          <h3>创意设计</h3>
          <p>注重用户体验，打造精美视觉效果</p>
        </el-card>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">5+</div>
        <div class="stat-label">年工作经验</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">20+</div>
        <div class="stat-label">完成项目</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">客户满意度</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Folder, Briefcase, Box, Star, Bell } from '@element-plus/icons-vue'
</script>

<style scoped>
.home {
  padding: 20px;
}

.hero-section {
  text-align: center;
}

.hero-content {
  margin-bottom: 50px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.3;
  filter: blur(20px);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
}

.primary-btn {
  background: white !important;
  color: #667eea !important;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
}

.primary-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.4) !important;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-3px);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.stats-section {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-top: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-section {
    flex-direction: column;
    gap: 30px;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style>
