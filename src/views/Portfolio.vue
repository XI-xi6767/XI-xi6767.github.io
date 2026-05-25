<template>
  <div class="portfolio">
    <div class="content">
      <div class="content-header">
        <h2 class="content-title">个人作品集</h2>
        <p class="content-desc">这是我的个人作品集，包含了我参与的多个项目</p>
      </div>

      <div class="section">
        <h3 class="section-title">
          <el-icon :size="20" color="#667eea"><Folder /></el-icon>
          个人作品集项目
        </h3>
        <p class="section-hint">访问 /projects/portfolio 查看完整项目列表</p>
      </div>

      <div class="skills-section">
        <h3 class="section-title">
          <el-icon :size="20" color="#667eea"><Bell /></el-icon>
          专业技能
        </h3>
        <div class="skills-tags">
          <el-tag v-for="skill in skills" :key="skill" class="skill-tag">
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
          <div v-for="(exp, index) in experience" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>{{ exp.company }}</h4>
              <span class="timeline-role">{{ exp.role }}</span>
              <span class="timeline-period">{{ exp.period }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Folder, Bell, Briefcase } from '@element-plus/icons-vue'

const skills = ref(['Vue.js', 'React', 'TypeScript', 'Python', 'UI/UX设计'])
const experience = ref([
  { company: 'ABC科技', role: '高级前端工程师', period: '2022-至今' },
  { company: 'XYZ互联网', role: '前端开发工程师', period: '2020-2022' }
])
</script>

<style scoped>
.portfolio {
  max-width: 900px;
  margin: 0 auto;
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

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-hint {
  color: #999;
  font-size: 0.9rem;
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
</style>
