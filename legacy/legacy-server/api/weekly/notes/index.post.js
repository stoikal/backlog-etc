import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data, error } = await client
    .schema('weekly')
    .from('notes')
    .upsert([
      {
        week_id: body.weekId,
        content: body.content
      },
    ])
    .select()      

  return { data, error, body }
})
