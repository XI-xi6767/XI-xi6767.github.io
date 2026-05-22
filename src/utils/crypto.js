import CryptoJS from 'crypto-js'

const generateKey = (password) => {
  return CryptoJS.PBKDF2(password, 'portfolio-salt', {
    keySize: 256 / 32,
    iterations: 1000
  })
}

export const encrypt = (data, password) => {
  const key = generateKey(password)
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return {
    ciphertext: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Base64)
  }
}

export const decrypt = (encryptedData, password) => {
  const key = generateKey(password)
  const iv = CryptoJS.enc.Base64.parse(encryptedData.iv)
  
  const decrypted = CryptoJS.AES.decrypt(encryptedData.ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  
  try {
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    return JSON.parse(plaintext)
  } catch {
    throw new Error('Invalid password or corrupted data')
  }
}

export const verifyPassword = (encryptedData, password) => {
  try {
    decrypt(encryptedData, password)
    return true
  } catch {
    return false
  }
}
