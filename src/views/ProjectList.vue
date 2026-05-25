<template>
  <div class="project-list">
    <div class="list-header">
      <h2 class="list-title">
        <el-icon :size="28" color="#667eea"><Briefcase /></el-icon>
        {{ isCompany ? '公司方案列表' : '个人作品集' }}
      </h2>
      <p class="list-desc">
        {{ isCompany ? '浏览我们为各公司提供的专业解决方案' : '展示个人精选设计作品' }}
      </p>
    </div>

    <div class="cards-container">
      <el-card 
        v-for="project in projects" 
        :key="project.id" 
        class="project-card"
        @click="$router.push(project.path)"
      >
        <div class="card-icon" v-if="project.thumbnail">
          <img :src="project.thumbnail" :alt="project.title" class="card-image" />
        </div>
        <div class="card-icon" v-else>
          <el-icon size="40" color="white">
            <Box />
          </el-icon>
        </div>
        <h3 class="card-title">{{ project.title }}</h3>
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
import { ref, computed, onMounted } from 'vue'
import { Briefcase, Box, ArrowRight, Folder } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { loadProjects, getProjectsByCategory } from '@/data/projects'

const route = useRoute()
const isLoading = ref(true)
const allProjects = ref([])

const isCompany = computed(() => route.params.category === 'company')

const projects = computed(() => {
  return getProjectsByCategory(route.params.category)
})

onMounted(async () => {
  await loadProjects()
  isLoading.value = false
})
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
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
