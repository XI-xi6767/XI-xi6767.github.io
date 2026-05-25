<template>
  <div class="project-explorer">
    <!-- 顶部导航栏 -->
    <div class="explorer-header">
      <div class="header-left">
        <h2 class="explorer-title">
          <el-icon :size="28" color="#667eea">
            <component :is="isCompany ? Briefcase : User" />
          </el-icon>
          {{ isCompany ? '公司方案' : '个人作品' }}
        </h2>
      </div>
      
      <!-- 面包屑导航 -->
      <div class="breadcrumb-nav">
        <div 
          v-for="(crumb, index) in breadcrumb" 
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumb.length - 1 }"
          @click="navigateTo(crumb.path)"
        >
          <el-icon v-if="index === 0" :size="16">
            <component :is="isCompany ? Briefcase : User" />
          </el-icon>
          <el-icon v-else :size="16"><Folder /></el-icon>
          <span>{{ crumb.name }}</span>
        </div>
      </div>
    </div>

    <!-- 文件/文件夹列表 -->
    <div class="explorer-content">
      <!-- 空状态 -->
      <div v-if="currentItems.length === 0" class="empty-state">
        <el-icon size="80" color="rgba(255, 255, 255, 0.3)"><FolderOpened /></el-icon>
        <h3>文件夹为空</h3>
        <p>这里还没有任何方案或文件夹</p>
      </div>
      
      <!-- 网格视图 -->
      <div v-else class="items-grid">
        <!-- 文件夹 -->
        <div 
          v-for="item in currentItems.filter(i => i.type === 'folder')" 
          :key="item.id"
          class="item-card folder-card"
          :class="{ special: item.isSpecial }"
          @click="openFolder(item)"
        >
          <div class="item-icon folder-icon">
            <el-icon :size="48"><Folder /></el-icon>
          </div>
          <div class="item-info">
            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-count">
              {{ countItems(item.children) }}
            </p>
          </div>
        </div>
        
        <!-- 项目/方案 -->
        <div 
          v-for="item in currentItems.filter(i => i.type === 'project')" 
          :key="item.id"
          class="item-card project-card"
          :class="{ special: item.isSpecial }"
          @click="openProject(item)"
        >
          <div class="item-icon project-icon">
            <el-icon :size="48"><Document /></el-icon>
          </div>
          <div class="item-info">
            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Briefcase, User, Folder, FolderOpened, Document } from '@element-plus/icons-vue'
import { loadProjects, getDirectoryContents, getBreadcrumb } from '@/data/projects'

const route = useRoute()
const router = useRouter()

const currentPath = ref([])

const isCompany = computed(() => route.params.category === 'company')

const breadcrumb = computed(() => {
  return getBreadcrumb(route.params.category, currentPath.value)
})

const currentItems = computed(() => {
  return getDirectoryContents(route.params.category, currentPath.value)
})

function navigateTo(path) {
  currentPath.value = [...path]
}

function openFolder(folder) {
  currentPath.value = [...currentPath.value, folder.name]
}

function openProject(project) {
  router.push(project.path)
}

function countItems(items) {
  let folders = 0
  let projects = 0
  for (const item of items) {
    if (item.type === 'folder') {
      folders++
      const childCount = countItems(item.children)
      folders += childCount.folders
      projects += childCount.projects
    } else {
      projects++
    }
  }
  const parts = []
  if (folders > 0) parts.push(`${folders} 个文件夹`)
  if (projects > 0) parts.push(`${projects} 个方案`)
  return parts.join(' · ') || '空文件夹'
}

onMounted(async () => {
  await loadProjects()
  
  // 检查路由参数中的路径
  if (route.query.path) {
    const pathParts = route.query.path.split('/').filter(Boolean)
    currentPath.value = pathParts
  }
})
</script>

<style scoped>
.project-explorer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 顶部导航栏 */
.explorer-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.explorer-title {
  font-size: 1.6rem;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.breadcrumb-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.breadcrumb-item.active {
  background: rgba(102, 126, 234, 0.3);
  color: white;
  cursor: default;
}

/* 文件列表 */
.explorer-content {
  min-height: 500px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.item-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.item-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}

/* 文件夹样式 */
.folder-card {
  border-top: 3px solid #667eea;
}

.folder-card.special {
  border-top-color: #f0c040;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(240, 192, 64, 0.08));
}

.folder-icon {
  color: #667eea;
}

.folder-card.special .folder-icon {
  color: #f0c040;
}

/* 项目样式 */
.project-card {
  border-top: 3px solid #764ba2;
}

.project-card.special {
  border-top-color: #ff6b6b;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 107, 107, 0.08));
}

.project-icon {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.project-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-icon {
  color: #667eea;
}

.item-info {
  width: 100%;
}

.item-title {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 6px 0;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-count {
  font-size: 0.85rem;
  color: #667eea;
  margin: 0;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state h3 {
  color: white;
  font-size: 1.4rem;
  margin: 20px 0 10px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
  
  .item-card {
    padding: 16px;
  }
  
  .item-icon {
    transform: scale(0.85);
  }
  
  .project-icon {
    width: 64px;
    height: 64px;
  }
  
  .item-title {
    font-size: 0.95rem;
  }
  
  .explorer-title {
    font-size: 1.3rem;
  }
}
</style>
