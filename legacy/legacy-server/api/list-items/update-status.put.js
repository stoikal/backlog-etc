import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const body = await readBody(event)

  const { data: rawData } = await client
    .schema('games_backlog')
    .from('game_statuses')
    .upsert([
      { game_id: body.gameId, is_finished: body.isFinished },
    ])
    .select()

  const item = rawData[0]
  const data = {
    gameId: item.game_id,
    isFinished: item.is_finished,
  }

  return { data }
})
