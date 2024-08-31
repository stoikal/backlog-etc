import { serverSupabaseClient } from '#supabase/server'

const getCombinedGameStatuses = async (client) => {
  const { data: rawData, error } = await client
    .rpc('get_combined_game_statuses')

  const decadeMap = rawData.reduce((res, item) => {
    const releaseDate = item.first_release_date

    if (!releaseDate) return res

    const year = new Date(releaseDate * 1000).getFullYear()
    const decade = Math.floor(year / 10) * 10 
    const decadeKey = `${decade}s`
    const list = res[decadeKey] || []

    return {
      ...res,
      [decadeKey]: [...list, item]
    }
  }, {})

  const data = Object.entries(decadeMap)
    .map(([key, items]) => ({
      listId: key,
      title: key,
      createdAt: new Date().toISOString(),
      pseudo: true,
      items: items.map((item) => ({
        gameId: item.game_id,
        gameTitle: item.name,
        isFinished: item.is_finished
      }))
    }))

  return {
    data,
    error
  }
}

const getLists = async (client) => {
  const { data: rawData } = await client
    .schema('games_backlog')
    .from('lists')
    .select(`
      id,
      title,
      created_at,
      list_items (
        game_id,
        ...games (
          name,
          game_statuses (
            is_finished
          )
        )
      )
    `)
    .order('title')

  const data = rawData?.map((list) => ({
    listId: list.id,
    title: list.title,
    createdAt: list.created_at,
    items: list.list_items?.map((item) => ({
      gameId: item.game_id,
      gameTitle: item.name,
      isFinished: item.game_statuses[0]?.is_finished
    }))
  }))

  return { data }
}

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  const [
    resGameStatues,
    resLists,
  ] = await Promise.all([
    getCombinedGameStatuses(client),
    getLists(client)
  ])

  return {
    data: resGameStatues.data.concat(resLists.data),
    error: resGameStatues.error
  }
})
