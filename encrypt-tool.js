import CryptoJS from 'crypto-js'
import fs from 'fs'

function encrypt(text, password) {
  return CryptoJS.AES.encrypt(text, password).toString()
}

function decrypt(ciphertext, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (e) {
    return null
  }
}

// 示例：加密内容
const portfolioContent = `
<h2>欢迎来到我的个人作品集</h2>
<p>这里展示了我的个人项目和技能介绍。</p>
<ul>
  <li>项目1: Web开发</li>
  <li>项目2: 移动端开发</li>
  <li>项目3: UI/UX设计</li>
</ul>
`

const projectA = `
<h3>A公司产品设计方案</h3>
<p>项目概述...</p>
`

const password1 = 'portfolio123'
const password2 = 'company-a-123'

console.log('=== 作品集加密结果 ===')
console.log('密码:', password1)
console.log('加密内容:', encrypt(portfolioContent, password1))
console.log('\n=== A公司方案加密结果 ===')
console.log('密码:', password2)
console.log('加密内容:', encrypt(projectA, password2))
