import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const workKey = decodeURIComponent(getRouterParam(event, 'workKey'))
  const body = await readBody(event)

  const { data } = await client
    .schema('reading_backlog')
    .from('work_statuses')
    .upsert([
      {
        work_key: workKey,
        is_finished: body.isFinished,
      },
    ])
    .select()

  return { data }
})
