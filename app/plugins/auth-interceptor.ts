function decodeToken(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function isTokenExpired(token: string) {
  const payload = decodeToken(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

export default defineNuxtPlugin(() => {
  let refreshing: Promise<string | null> | null = null

  async function refreshToken(): Promise<string | null> {
    try {
      const res = await $fetch('/api/auth/refresh', { method: 'POST' })
      localStorage.setItem('accessToken', res.token)
      return res.token
    } catch {
      localStorage.removeItem('accessToken')
      return null
    }
  }

  async function ensureToken(): Promise<string | null> {
    if (!import.meta.client) return null
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    if (!isTokenExpired(token)) return token
    if (!refreshing) refreshing = refreshToken().finally(() => { refreshing = null })
    return refreshing
  }

  async function request<T = any>(url: string, opts: any = {}): Promise<T> {
    const token = await ensureToken()
    if (token) {
      opts.headers = { ...opts.headers, Authorization: `Bearer ${token}` }
    }
    try {
      return await $fetch<T>(url, opts)
    } catch (err: any) {
      if (
        (err?.status === 401 || err?.status === 403) && token
        && !url.toString().includes('/api/auth/refresh')
      ) {
        const newToken = await refreshToken()
        if (newToken) {
          opts.headers = { ...opts.headers, Authorization: `Bearer ${newToken}` }
          return $fetch<T>(url, opts)
        }
      }
      throw err
    }
  }

  const api = {
    get<T>(url: string, opts?: any) { return request<T>(url, { ...opts, method: 'GET' }) },
    post<T>(url: string, opts?: any) { return request<T>(url, { ...opts, method: 'POST' }) },
    put<T>(url: string, opts?: any) { return request<T>(url, { ...opts, method: 'PUT' }) },
    delete<T>(url: string, opts?: any) { return request<T>(url, { ...opts, method: 'DELETE' }) },
  }

  return { provide: { api } }
})