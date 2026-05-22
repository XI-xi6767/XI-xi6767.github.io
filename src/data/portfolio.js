import { encrypt } from '../utils/crypto'

const portfolioContent = {
  title: '个人作品集',
  description: '这是我的个人作品集，包含了我参与的多个项目',
  projects: [
    {
      id: 'project-1',
      name: '电商平台重构',
      category: 'Web开发',
      year: '2024',
      description: '使用Vue3和TypeScript重构了一个大型电商平台'
    },
    {
      id: 'project-2',
      name: '移动端App设计',
      category: 'UI设计',
      year: '2023',
      description: '为金融公司设计的移动端理财应用'
    },
    {
      id: 'project-3',
      name: '数据分析仪表盘',
      category: '数据可视化',
      year: '2024',
      description: '企业级数据分析可视化解决方案'
    }
  ],
  skills: ['Vue.js', 'React', 'TypeScript', 'Python', 'UI/UX设计'],
  experience: [
    { company: 'ABC科技', role: '高级前端工程师', period: '2022-至今' },
    { company: 'XYZ互联网', role: '前端开发工程师', period: '2020-2022' }
  ]
}

const defaultPassword = 'portfolio123'

export const portfolioData = {
  encryptedContent: encrypt(portfolioContent, defaultPassword),
  hint: '默认密码: portfolio123'
}
