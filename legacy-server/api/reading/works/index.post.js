import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const work = await readBody(event)

  // FIXME this is problematic
  await client
    .schema('reading_backlog')
    .from('ref_works')
    .upsert([{
      key: work.key,
      title: work.title,
      alternative_title: work.alternative_title,
      subtitle: work.subtitle,
      alternative_subtitle: work.alternative_subtitle,
      first_publish_year: work.firstPublishYear,
      type: work.type,
      number_of_pages_median: work.numberOfPagesMedian,
    }])
    .select()

  if (work.languages?.length) {
    const languages = work.languages
      .map((languageKey) => ({
        key: languageKey,
      }))

    const workLanguages = work.languages
      .map((languageKey) => ({
        work_key: work.key,
        language_key: languageKey,
      }))


    await client
      .schema('reading_backlog')
      .from('ref_languages')
      .upsert(languages)
      .select()
      

    await client
      .schema('reading_backlog')
      .from('ref_works_languages')
      .upsert(workLanguages)
      .select()
  }

  if (work.authors?.length) {
    const workAuthors = work.authors
      .map((author) => ({
        work_key: work.key,
        author_key: author.key,
      }))


    await client
      .schema('reading_backlog')
      .from('ref_authors')
      .upsert(work.authors)
      .select()
      

    await client
      .schema('reading_backlog')
      .from('ref_works_authors')
      .upsert(workAuthors)
      .select()
  }

  return { data: null }
})
