import { ref, computed } from 'vue'

const GITHUB_CLIENT_ID = 'Ov23lirIxz2Dsxcw3QzI'
const OWNER_USERNAME = 'XI-xi6767'

const NETLIFY_FUNCTION_URL = '.netlify/functions/github-oauth'

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

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  async function handleCallback() {
    const queryParams = new URLSearchParams(window.location.search)
    const code = queryParams.get('code')
    const state = queryParams.get('state')
    const error = queryParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      return false
    }

    if (state !== sessionStorage.getItem('github_oauth_state')) {
      console.error('State mismatch')
      return false
    }

    if (code) {
      try {
        const baseUrl = getBaseUrl()
        const response = await fetch(`${baseUrl}/.netlify/functions/github-oauth?code=${code}`)

        if (!response.ok) {
          throw new Error('Failed to exchange code for token')
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        githubToken.value = data.token
        githubUser.value = data.user
        sessionStorage.setItem('github_token', data.token)
        sessionStorage.setItem('github_user', JSON.stringify(data.user))

        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)

        return true
      } catch (error) {
        console.error('Error during OAuth callback:', error)
        return false
      }
    }

    return false
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
    handleCallback,
    checkAuth,
    githubUser,
    simulateLogin
  }
}
