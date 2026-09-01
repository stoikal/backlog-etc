import { serverSupabaseClient } from '#supabase/server'

// TODO implement soft delete?
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const listId = getRouterParam(event, 'listId')

  const { data } = await client
    .schema('games_backlog')
    .from('lists')
    .delete()
    .eq('id', listId)

  return { data }
})
