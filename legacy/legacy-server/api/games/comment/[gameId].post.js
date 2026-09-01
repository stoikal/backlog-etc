import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gameId = getRouterParam(event, 'gameId')
  const body = await readBody(event)

  const { data: rawData } = await client
    .schema('games_backlog')
    .from('game_comments  ')
    .upsert([{
      game_id: gameId,
      comment: body.comment,
    }])
    .select()
  
  const comment = rawData[0]
  const data = {
    gameId: comment.game_id,
    comment: comment.comment,
  }

  return { data }
})
