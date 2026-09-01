import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)
  const listItems = body.listItems.map((item) => ({
    game_id: item.gameId,
    list_id: item.listId,
  }))

  const { data } = await client
    .schema('games_backlog')
    .from('list_items')
    .insert(listItems)
    .select()

  return { data }
})
