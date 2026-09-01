import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gameId = getRouterParam(event, 'gameId')

  const { data: rawData } = await client
    .schema('games_backlog')
    .from('games')
    .select(`
      *,
      games_platforms (
        ...platforms (
          id,
          name,
          url,
          logo_url,
          alternative_name
        )
      ),
      games_genres (
        ...genres (
          id,
          name,
          url
        )
      )
    `)
    .eq('id', gameId)
  
  const game = rawData[0]
  const data = {
    id: game.id,
    name: game.name,
    firstReleaseDate: game.first_release_date,
    platforms: game.games_platforms.map((platform) => ({
      id: platform.id,
      name: platform.name,
      alternativeName: platform.alternative_name,
    })),
    genres: game.games_genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    }))
  }

  return { data }
})
