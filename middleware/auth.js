import { APP_ROUTES } from '~/constants/routes'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { initAuth, isAuthenticated } = useAuth()

  if (isAuthenticated.value) {
    return
  }

  const isValid = await initAuth()

  if (!isValid) {
    return navigateTo(APP_ROUTES.login)
  }
})
