export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('accessToken').value
  const isLoginPage = to.path === '/login'

  if (isLoginPage && token) return navigateTo('/')
  if (!isLoginPage && !token) return navigateTo('/login')
})