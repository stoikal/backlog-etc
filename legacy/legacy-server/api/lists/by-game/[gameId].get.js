import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gameId = getRouterParam(event, 'gameId')

  let { data: rawData } = await client
    .schema('games_backlog')
    .from('list_items')
    .select(`
      ...lists (*)  
    `)
    .eq('game_id', gameId)

  const data = rawData?.map((list) => ({
    listId: list.id,
    title: list.title,
    createdAt: list.created_at,
  }))

  return { data }
})
