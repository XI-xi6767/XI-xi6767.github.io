import { ref, computed } from 'vue'

const GITHUB_CLIENT_ID = 'Ov23lirIxz2Dsxcw3QzI'
const OWNER_USERNAME = 'XI-xi6767'

const githubToken = ref(null)
const githubUser = ref(null)
const isLoading = ref(false)

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export function useGithubAuth() {
  const isOwner = computed(() => {
    return githubUser.value?.login === OWNER_USERNAME
  })

  const isAuthenticated = computed(() => {
    return githubToken.value !== null && githubUser.value !== null
  })

  function login() {
    isLoading.value = true
    
    const state = generateRandomString(16)
    sessionStorage.setItem('github_oauth_state', state)

    const baseUrl = getBaseUrl()
    const redirectUri = `${baseUrl}/.netlify/functions/github-oauth`

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'read:user',
      state: state
    })

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`
    
    const width = 600
    const height = 600
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    const popup = window.open(
      authUrl,
      'GitHub OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    const handleMessage = (event) => {
      if (event.data?.type === 'GITHUB_OAUTH_SUCCESS') {
        const { token, user } = event.data
        
        githubToken.value = token
        githubUser.value = user
        sessionStorage.setItem('github_token', token)
        sessionStorage.setItem('github_user', JSON.stringify(user))
        
        popup.close()
        isLoading.value = false
        
        window.removeEventListener('message', handleMessage)
      }
    }

    window.addEventListener('message', handleMessage)
  }

  function logout() {
    githubToken.value = null
    githubUser.value = null
    sessionStorage.removeItem('github_token')
    sessionStorage.removeItem('github_user')
  }

  function checkAuth() {
    const savedToken = sessionStorage.getItem('github_token')
    const savedUser = sessionStorage.getItem('github_user')

    if (savedToken && savedUser) {
      githubToken.value = savedToken
      githubUser.value = JSON.parse(savedUser)
      return true
    }
    return false
  }

  function simulateLogin() {
    const mockUser = {
      login: OWNER_USERNAME,
      id: 12345678,
      avatar_url: 'https://avatars.githubusercontent.com/u/12345678',
      name: 'XI-xi6767',
      email: 'test@example.com'
    }
    githubToken.value = 'mock_token'
    githubUser.value = mockUser
    sessionStorage.setItem('github_token', 'mock_token')
    sessionStorage.setItem('github_user', JSON.stringify(mockUser))
  }

  function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  return {
    isOwner,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    githubUser,
    simulateLogin
  }
}
