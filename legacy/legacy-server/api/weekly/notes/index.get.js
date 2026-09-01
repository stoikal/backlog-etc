import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { weekId } = getQuery(event)

  const { data: rawData, error } = await client
    .schema('weekly')
    .from('notes')
    .select()
    .eq('week_id', Number(weekId));
    
  const data = {
    id: rawData[0]?.id,
    weekId: rawData[0]?.week_id,
    content: rawData[0]?.content,
  }

  return { data, weekId, error, rawData }
})
