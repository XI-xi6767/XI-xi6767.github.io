import { ref } from 'vue'
import staticProjectsData from './projects-data.json' assert { type: 'json' }

const projectsData = ref({ company: [], portfolio: [], timestamp: 0 })

export async function loadProjects() {
  try {
    let data = staticProjectsData
    
    try {
      const response = await fetch('/.netlify/functions/scan-projects')
      data = await response.json()
    } catch (apiError) {
      console.log('API unavailable, using static data')
    }
    
    projectsData.value = {
      company: data.company || [],
      portfolio: data.portfolio || [],
      timestamp: data.timestamp || Date.now()
    }
    
    return projectsData.value
  } catch (error) {
    console.error('Error loading projects:', error)
    return { company: [], portfolio: [], timestamp: 0 }
  }
}

// 递归查找项目 - 根据路径查找
function findProjectByPath(items, path) {
  // 检查路径是否带 index.html
  const pathWithIndex = path.endsWith('/index.html') ? path : path + '/index.html'
  const pathWithoutIndex = path.endsWith('/index.html') ? path.slice(0, -11) : path
  
  for (const item of items) {
    if (item.type === 'project') {
      if (item.path === path || item.path === pathWithIndex || item.path === pathWithoutIndex) {
        return item
      }
    }
    if (item.type === 'folder' && item.children) {
      const found = findProjectByPath(item.children, path)
      if (found) return found
    }
  }
  return null
}

export function getProjectByPath(path, category = null) {
  if (category) {
    return findProjectByPath(projectsData.value[category] || [], path)
  }
  // 先查 company，再查 portfolio
  let found = findProjectByPath(projectsData.value.company || [], path)
  if (found) return found
  return findProjectByPath(projectsData.value.portfolio || [], path)
}

// 兼容旧接口 - 扁平的项目列表
function flattenProjects(items, category) {
  const result = []
  for (const item of items) {
    if (item.type === 'project') {
      result.push({
        ...item,
        category: category
      })
    }
    if (item.type === 'folder' && item.children) {
      result.push(...flattenProjects(item.children, category))
    }
  }
  return result
}

export function getProjectsByCategory(category) {
  const items = projectsData.value[category] || []
  return flattenProjects(items, category)
}

export function getProjectById(id) {
  const companyProjects = flattenProjects(projectsData.value.company || [], 'company')
  const portfolioProjects = flattenProjects(projectsData.value.portfolio || [], 'portfolio')
  const allProjects = [...companyProjects, ...portfolioProjects]
  return allProjects.find(p => p.id === id)
}

// 获取某个目录的内容
export function getDirectoryContents(category, pathParts = []) {
  let currentItems = projectsData.value[category] || []
  
  for (const part of pathParts) {
    let found = null
    for (const item of currentItems) {
      if (item.type === 'folder' && item.name === part) {
        found = item
        break
      }
    }
    if (found && found.children) {
      currentItems = found.children
    } else {
      return []
    }
  }
  
  return currentItems
}

// 构建面包屑导航
export function getBreadcrumb(category, pathParts = []) {
  const breadcrumb = [
    { name: category === 'company' ? '公司方案' : '个人作品', path: [] }
  ]
  
  let currentPath = []
  for (const part of pathParts) {
    currentPath.push(part)
    let displayName = part
    // 尝试从数据中获取更好的名字
    const contents = getDirectoryContents(category, currentPath.slice(0, -1))
    const folder = contents.find(item => item.type === 'folder' && item.name === part)
    if (folder) {
      displayName = folder.title
    }
    breadcrumb.push({ name: displayName, path: [...currentPath] })
  }
  
  return breadcrumb
}

export { projectsData }
