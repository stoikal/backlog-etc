import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const workKey = decodeURIComponent(getRouterParam(event, 'workKey'))
  const body = await readBody(event)
  const listIds = body.listIds

  const { data } = await client
    .schema('reading_backlog')
    .from('list_items')
    .insert(
      listIds.map((listId) => ({
        list_id: listId,
        work_key: workKey,
      }))
    )
    .select()

  return { data }
})
