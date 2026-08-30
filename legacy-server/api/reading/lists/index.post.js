import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data } = await client
    .schema('reading_backlog')
    .from('lists')
    .insert([
      { title: body.title },
    ])
    .select()      

  return { data }
})
