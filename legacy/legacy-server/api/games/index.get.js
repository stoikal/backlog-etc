import { serverSupabaseClient } from '#supabase/server'

const {
  PROVIDER_CLIENT_ID,
  PROVIDER_CLIENT_SECRET,
  PROVIDER_BASE_URL,
  PROVIDER_AUTH_URL,
} = process.env

let token = {
  accessToken: '',
  expiredMs: null,
}

const getToken = async () => {
  if (token.expiredMs < new Date().getTime()) {
    const res = await $fetch(PROVIDER_AUTH_URL, {
      method: 'POST',
      params: {
        client_id: PROVIDER_CLIENT_ID,
        client_secret: PROVIDER_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    })
  
    token = {
      accessToken: res.access_token,
      expiredMs: new Date().getTime() + res.expires_in * 1000
    }
  }


  return token.accessToken
}

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()

  if (!user) return { data: null }

  const { search, platform } = getQuery(event)
  const accessToken = await getToken()

  let body = 'fields name, first_release_date, platforms.name, genres.name;'

  if (search) body += `search "${search}";`
  if (platform) body += `where platforms = (${platform});`
  body += 'limit 40;'

  try {

    const rawData = await $fetch(`${PROVIDER_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': PROVIDER_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`
      },
      body,
    })
    const data = rawData
      .map((item) => ({
        id: item.id,
        name: item.name,
        firstReleaseDate: item.first_release_date,
        genres: item.genres,
        platforms: item.platforms,
      }))
  
    return { data }
  } catch {
    return { data: null }
  }
})
