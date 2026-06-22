import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { APP_ROUTES } from '~/constants/routes'
import { STORAGE_KEYS } from '~/constants/storage'

const user = ref(null)
const accessToken = ref('')
const refreshToken = ref('')
const isLoading = ref(false)
const error = ref('')

export const useAuth = () => {
    const api = useApi()

    const isAuthenticated = computed(() => !!accessToken.value)

    const getErrorMessage = (err, defaultMessage) => {
        if (err?.data?.detail) return err.data.detail
        if (err?.data?.message) return err.data.message
        if (err?.message) return err.message
        return defaultMessage
    }

    const saveTokens = (response) => {
        const token = response.access || response.access_token
        const refresh = response.refresh || response.refresh_token

        if (token) {
            accessToken.value = token
            localStorage.setItem(STORAGE_KEYS.accessToken, token)
        }

        if (refresh) {
            refreshToken.value = refresh
            localStorage.setItem(STORAGE_KEYS.refreshToken, refresh)
        }

        // ✅ ذخیره user از پاسخ
        if (response.user) {
            user.value = response.user
        }
    }

    const initAuth = async () => {
        if (!process.client) return false

        accessToken.value = localStorage.getItem(STORAGE_KEYS.accessToken) || ''
        refreshToken.value = localStorage.getItem(STORAGE_KEYS.refreshToken) || ''

        // ✅ اگر توکن داریم، اطلاعات کاربر رو بگیر
        if (accessToken.value) {
            try {
                await fetchMe()
                return true
            } catch (e) {
                console.error('Failed to fetch user on init:', e)
                // اگر fetchMe شکست خورد، احتمالاً توکن منقضی شده
                await logout()
                return false
            }
        }

        return false
    }

    const login = async (credentials) => {
        isLoading.value = true
        error.value = ''

        try {
            const response = await api.post('/login/', {
                username: credentials.username,
                password: credentials.password,
            })

            // ✅ saveTokens حالا user رو هم ذخیره می‌کنه
            saveTokens(response)

            return response
        } catch (err) {
            error.value = getErrorMessage(err, 'ورود ناموفق بود')
            // پاک کردن state در صورت خطا
            accessToken.value = ''
            refreshToken.value = ''
            user.value = null
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const register = async (payload) => {
        isLoading.value = true
        error.value = ''

        try {
            const response = await api.post('/register/', payload)
            // ✅ احتمالاً register هم user برمی‌گردونه
            saveTokens(response)
            return response
        } catch (err) {
            error.value = getErrorMessage(err, 'ثبت‌نام ناموفق بود')
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchMe = async () => {
        if (!isAuthenticated.value) return null

        try {
            const response = await api.get('/me/')
            user.value = response
            return response
        } catch (err) {
            console.error('Failed to fetch user:', err)
            user.value = null
            // اگر 401 اومد، لاگ‌اوت کن
            if (err.response?.status === 401) {
                await logout()
            }
            throw err
        }
    }

    const logout = async () => {
        try {
            if (refreshToken.value) {
                await api.post('/logout/', {
                    refresh: refreshToken.value
                })
            }
        } catch (err) {
            console.warn('Logout API failed:', err)
        } finally {
            accessToken.value = ''
            refreshToken.value = ''
            user.value = null

            if (process.client) {
                localStorage.removeItem(STORAGE_KEYS.accessToken)
                localStorage.removeItem(STORAGE_KEYS.refreshToken)
            }

            await navigateTo(APP_ROUTES.login)
        }
    }

    return {
        user,
        accessToken,
        refreshToken,
        isLoading,
        error,
        isAuthenticated,
        initAuth,
        login,
        register,
        fetchMe,
        logout,
    }
}
