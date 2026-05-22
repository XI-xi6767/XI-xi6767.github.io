import { encrypt } from '../utils/crypto'

const projectsContent = {
  companyA: {
    id: 'company-a',
    name: 'A公司方案',
    description: 'A公司的产品设计方案',
    password: 'company-a-123',
    data: {
      sections: [
        {
          title: '项目概述',
          content: '为A公司设计的企业级产品解决方案，包含前端展示和后端管理系统'
        },
        {
          title: '技术栈',
          content: 'Vue3 + TypeScript + Element Plus'
        },
        {
          title: '交付成果',
          content: '完整的设计稿、前端代码、API文档'
        }
      ]
    }
  },
  companyB: {
    id: 'company-b',
    name: 'B公司方案',
    description: 'B公司的移动端应用方案',
    password: 'company-b-123',
    data: {
      sections: [
        {
          title: '项目概述',
          content: '为B公司设计的移动端金融理财应用'
        },
        {
          title: '技术栈',
          content: 'React Native + Redux + TypeScript'
        },
        {
          title: '交付成果',
          content: '移动端App、后台管理系统、接口文档'
        }
      ]
    }
  }
}

export const projectsList = [
  {
    id: 'company-a',
    name: 'A公司方案',
    description: 'A公司的产品设计方案',
    encryptedContent: encrypt(projectsContent.companyA.data, projectsContent.companyA.password),
    hint: '密码提示: company-a-123'
  },
  {
    id: 'company-b',
    name: 'B公司方案',
    description: 'B公司的移动端应用方案',
    encryptedContent: encrypt(projectsContent.companyB.data, projectsContent.companyB.password),
    hint: '密码提示: company-b-123'
  }
]
