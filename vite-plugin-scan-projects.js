// 直接在插件中实现扫描逻辑，避免 CommonJS/ES Module 兼容问题
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 特殊文件夹标识
const SPECIAL_FOLDER_PREFIXES = ['!', '@', '#', '$']

function isSpecialFolder(name) {
  return SPECIAL_FOLDER_PREFIXES.some(prefix => name.startsWith(prefix))
}

function getCleanFolderName(name) {
  if (isSpecialFolder(name)) {
    return name.slice(1)
  }
  return name
}

function formatFolderName(name) {
  let cleanName = getCleanFolderName(name)
  cleanName = cleanName.replace(/-/g, ' ').replace(/_/g, ' ')
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
}

// 辅助函数：构建统一的路径（使用正斜杠）
function buildPath(...parts) {
  return parts.map(p => p.split(/[/\\]/).filter(Boolean)).flat().join('/')
}

function scanDirectory(dirPath, basePath = '') {
  const items = []
  
  if (!fs.existsSync(dirPath)) {
    return items
  }

  const dirItems = fs.readdirSync(dirPath, { withFileTypes: true })
  
  for (const item of dirItems) {
    const itemPath = path.join(dirPath, item.name)
    const itemBasePath = buildPath(basePath, item.name)
    
    if (item.isDirectory()) {
      // 检查这个文件夹是否是一个项目（有html文件）
      const files = fs.readdirSync(itemPath)
      let hasHtml = files.some(file => file.toLowerCase().endsWith('.html'))
      
      let thumbnail = ''
      const imagesDirs = [
        path.join(itemPath, 'images'),
        path.join(itemPath, 'imgs')
      ]
      
      for (const imagesDir of imagesDirs) {
        if (fs.existsSync(imagesDir)) {
          const images = fs.readdirSync(imagesDir)
          const thumbnails = images.filter(img => 
            img.match(/(thumbnail|cover|preview)/i) || 
            ['jpg', 'jpeg', 'png', 'webp'].includes(img.split('.').pop().toLowerCase())
          )
          if (thumbnails.length > 0) {
            const imgDirName = path.basename(imagesDir)
            thumbnail = `/${buildPath(itemBasePath, imgDirName, thumbnails[0])}`
            break
          }
        }
      }
      
      if (hasHtml) {
        // 这是一个项目文件夹
        let htmlFile = null
        for (const file of files) {
          if (file.toLowerCase().endsWith('.html')) {
            htmlFile = file
            break
          }
        }
        
        let title = formatFolderName(item.name)
        let description = ''
        // 始终显式地包含 index.html，避免与路由路径冲突
        let projectPath = `/${buildPath(itemBasePath, 'index.html')}`
        
        if (htmlFile) {
          const htmlPath = path.join(itemPath, htmlFile)
          const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
          
          const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i)
          if (titleMatch) {
            title = titleMatch[1].trim()
          }
          
          const metaDesc = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
          if (metaDesc) {
            description = metaDesc[1].trim()
          }
          
          // 如果不是 index.html，使用实际的文件名
          if (htmlFile.toLowerCase() !== 'index.html') {
            projectPath = `/${buildPath(itemBasePath, htmlFile)}`
          }
        }
        
        items.push({
          type: 'project',
          id: item.name,
          name: item.name,
          title: title,
          description: description || '暂无描述',
          path: projectPath,
          thumbnail: thumbnail,
          isSpecial: isSpecialFolder(item.name)
        })
      } else {
        // 这是一个普通文件夹，继续扫描子目录
        const children = scanDirectory(itemPath, itemBasePath)
        items.push({
          type: 'folder',
          id: item.name,
          name: item.name,
          title: formatFolderName(item.name),
          path: `/${itemBasePath}`,
          children: children,
          isSpecial: isSpecialFolder(item.name)
        })
      }
    }
  }
  
  // 排序：特殊文件夹在前，然后普通文件夹，最后项目
  items.sort((a, b) => {
    if (a.isSpecial && !b.isSpecial) return -1
    if (!a.isSpecial && b.isSpecial) return 1
    if (a.type === 'folder' && b.type === 'project') return -1
    if (a.type === 'project' && b.type === 'folder') return 1
    return a.name.localeCompare(b.name)
  })
  
  return items
}

function scanProjects() {
  const projectsDir = path.join(__dirname, 'public', 'projects')
  
  if (!fs.existsSync(projectsDir)) {
    return { company: [], portfolio: [], timestamp: Date.now() }
  }

  const categories = ['company', 'portfolio']
  const result = { company: [], portfolio: [], timestamp: Date.now() }

  for (const category of categories) {
    const categoryDir = path.join(projectsDir, category)
    
    if (!fs.existsSync(categoryDir)) {
      continue
    }

    result[category] = scanDirectory(categoryDir, `projects/${category}`)
  }

  return result
}

export default function vitePluginScanProjects() {
  return {
    name: 'vite-plugin-scan-projects',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/scan-projects', (req, res, next) => {
        if (req.method === 'GET') {
          const result = scanProjects()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(result))
        } else {
          next()
        }
      })
    }
  }
}
