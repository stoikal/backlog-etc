import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const workKey = decodeURIComponent(getRouterParam(event, 'workKey'))

  let { data: rawData } = await client
    .schema('reading_backlog')
    .from('list_items')
    .select(`
      ...lists (*)  
    `)
    .eq('work_key', workKey)

  const data = rawData?.map((list) => ({
    listId: list.id,
    title: list.title,
    createdAt: list.created_at,
  }))

  return { data }
})
