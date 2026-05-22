<template>
  <div class="project-list">
    <div class="list-header">
      <h2 class="list-title">
        <el-icon :size="28" color="#667eea"><Briefcase /></el-icon>
        公司方案列表
      </h2>
      <p class="list-desc">浏览我们为各公司提供的专业解决方案</p>
    </div>

    <div class="cards-container">
      <el-card 
        v-for="project in projects" 
        :key="project.id" 
        class="project-card"
        @click="$router.push(`/projects/${project.id}`)"
      >
        <div class="card-icon">
          <el-icon size="40" color="white">
            <Box />
          </el-icon>
        </div>
        <h3 class="card-title">{{ project.name }}</h3>
        <p class="card-desc">{{ project.description }}</p>
        <div class="card-action">
          <span>查看详情</span>
          <el-icon :size="18"><ArrowRight /></el-icon>
        </div>
      </el-card>
    </div>

    <div class="empty-state" v-if="projects.length === 0">
      <el-icon size="64" color="#ccc"><Folder /></el-icon>
      <p>暂无方案数据</p>
    </div>
  </div>
</template>

<script setup>
import { Briefcase, Box, ArrowRight, Folder } from '@element-plus/icons-vue'
import { projectsList } from '@/data/projects'

const projects = projectsList
</script>

<style scoped>
.project-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  text-align: center;
  margin-bottom: 40px;
}

.list-title {
  font-size: 2.2rem;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.list-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.85);
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.project-card {
  background: rgba(255, 255, 255, 0.95) !important;
  padding: 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px !important;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.project-card:hover .card-icon {
  transform: scale(1.1);
}

.card-title {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 12px;
}

.card-desc {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.project-card:hover .card-action {
  gap: 12px;
  color: #764ba2;
}

.empty-state {
  text-align: center;
  padding: 60px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 20px;
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .list-title {
    font-size: 1.8rem;
  }
}
</style>
