export default defineNuxtPlugin(() => {
  const tokenCookie = useCookie('accessToken')

  const api = $fetch.create({
    onRequest({ options }) {
      if (tokenCookie.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenCookie.value}`
        }
      }
    }
  })

  return { provide: { api } }
})