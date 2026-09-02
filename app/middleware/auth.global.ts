export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const token = localStorage.getItem('accessToken')
  const isLoginPage = to.path === '/login'

  if (isLoginPage && token) return navigateTo('/')
  if (!isLoginPage && !token) return navigateTo('/login')
})