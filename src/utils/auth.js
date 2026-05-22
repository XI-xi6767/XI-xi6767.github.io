import { ref, computed } from 'vue'

const OWNER_PASSWORD = 'portfolio123'

const isAuthenticated = ref(false)
const isOwner = ref(false)

export function useAuth() {
  function verifyOwner(password) {
    if (password === OWNER_PASSWORD) {
      isAuthenticated.value = true
      isOwner.value = true
      sessionStorage.setItem('auth_isOwner', 'true')
      return true
    }
    return false
  }

  function checkAuth() {
    const stored = sessionStorage.getItem('auth_isOwner')
    if (stored === 'true') {
      isAuthenticated.value = true
      isOwner.value = true
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    isOwner.value = false
    sessionStorage.removeItem('auth_isOwner')
  }

  function login(password) {
    if (verifyOwner(password)) {
      return { success: true, isOwner: true }
    }
    return { success: false, isOwner: false }
  }

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    isOwner: computed(() => isOwner.value),
    login,
    logout,
    checkAuth
  }
}

export function checkIsSharedLink(route) {
  return route.query.shared === 'true'
}
