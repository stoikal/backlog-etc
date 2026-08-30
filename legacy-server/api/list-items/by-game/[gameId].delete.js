import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gameId = getRouterParam(event, 'gameId')
  const body = await readBody(event)
  const listIds = body.listIds

  const { data } = await client
    .schema('games_backlog')
    .from('list_items')
    .delete()
    .eq('game_id', gameId)
    .in('list_id', listIds)

  return { data }
})
