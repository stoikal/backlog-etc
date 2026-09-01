import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const listId = getRouterParam(event, 'listId')
  const body = await readBody(event)

  const { data } = await client
    .schema('games_backlog')
    .from('lists')
    .update({ title: body.title })
    .eq('id', listId)
    .select()
        
  return { data }
})
