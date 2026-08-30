import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const workKey = decodeURIComponent(getRouterParam(event, 'workKey'))

  const { data: rawData, error } = await client
    .schema('reading_backlog')
    .from('ref_works')
    .select(`
      key,
      title,
      first_publish_year,
      type,
      number_of_pages_median,
      ref_works_authors (
        ...ref_authors (
          key,
          name
        )
      ),
      ref_works_languages (
        ...ref_languages (
          key,
          name
        )
      )
    `)
    .eq('key', workKey)
  
  const work = rawData[0] ?? {}
  const data = {
    key: work.key,
    title: work.title,
    firstPublishYear: work.first_publish_year,
    authors: work.ref_works_authors?.map((author) => ({
      key: author.key,
      name: author.name
    })),
    languages: work.ref_works_languages?.map((language) => ({
      key: language.key,
      name: language.name,
    }))
  }

  return { data, error, rawData }
})
