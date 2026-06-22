import { APP_ROUTES } from '~/constants/routes'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { initAuth, isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    await initAuth()
  }

  if (isAuthenticated.value) {
    return navigateTo(APP_ROUTES.home)
  }
})
