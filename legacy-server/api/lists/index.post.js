import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data: rawData } = await client
    .schema('games_backlog')
    .from('lists')
    .insert([
      { title: body.title },
    ])
    .select()

  const list = rawData[0]
  const data = {
    id: list.id,
    title: list.title
  }

  return { data }
})
