export default defineEventHandler(async (event) => {
  const slug = event.context.params?.path || ''
  const targetPath = slug ? `/api/${slug}` : '/api'

  const query = getQuery(event)
  const url = new URL(targetPath, 'http://localhost:8080')

  Object.entries(query).forEach(([key, val]) => {
    if (val !== undefined) url.searchParams.set(key, String(val))
  })

  return proxyRequest(event, url.toString())
})