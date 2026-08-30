import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gameId = getRouterParam(event, 'gameId')

  const { data: rawData } = await client
    .schema('games_backlog')
    .from('game_comments')
    .select()
    .eq('game_id', gameId)
  
  const comment = rawData[0] || {}
  const data = {
    gameId: comment.game_id,
    userId: comment.user_id,
    comment: comment.comment,
  }


  return { data, rawData }
})
