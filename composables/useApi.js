import { STORAGE_KEYS } from '~/constants/storage'

export const useApi = () => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const getAuthToken = () => {
    if (process.client) {
      return localStorage.getItem(STORAGE_KEYS.accessToken)
    }
    return null
  }

  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken()

    const headers = {
      ...(options.headers || {}),
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await $fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
        body: options.body,
      })

      return response
    } catch (error) {
      console.error('API Error:', error)

      if (error.response?.status === 401) {
        if (process.client) {
          localStorage.removeItem(STORAGE_KEYS.accessToken)
          localStorage.removeItem(STORAGE_KEYS.refreshToken)
          router.push('/login')
        }
      }

      if (error.data && typeof error.data === 'string' && error.data.includes('<!DOCTYPE')) {
        console.error('Server returned HTML instead of JSON. Endpoint might not exist:', endpoint)
        throw new Error(`API endpoint not found: ${endpoint}`)
      }

      throw error
    }
  }

  return {
    get: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: 'PATCH', body }),
    patch: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: 'DELETE' }),
  }
}
