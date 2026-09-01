import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const listId = getRouterParam(event, 'listId')
  const body = await readBody(event)
  const gameIds = body.gameIds

  const { data } = await client
    .schema('games_backlog')
    .from('list_items')
    .delete()
    .eq('list_id', listId)
    .in('game_id', gameIds)

  return { data }
})
