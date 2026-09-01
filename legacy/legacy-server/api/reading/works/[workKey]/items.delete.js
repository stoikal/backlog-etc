import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const workKey = decodeURIComponent(getRouterParam(event, 'workKey'))
  const body = await readBody(event)
  const listIds = body.listIds

  const { data, error } = await client
    .schema('reading_backlog')
    .from('list_items')
    .delete()
    .eq('work_key', workKey)
    .in('list_id', listIds)

  return { data, error, listIds, workKey, rawWOrkKey: getRouterParam(event, 'workKey')  }
})
