const openLibrary = {
  async search (searchKey: string) {
    const url = 'https://openlibrary.org/search.json?'

    const fields = [
      'key',
      'title',
      'alternative_title',
      'subtitle',
      'alternative_subtitle',
      'author_key',
      'author_name',
      'first_publish_year',
      'language',
      'number_of_pages_median',
      'type',
    ]

    const params = new URLSearchParams({
      q: searchKey.trim().toLowerCase().replaceAll(' ', '+'),
      fields: fields.join(','),
      limit: '20',
    })

    const response = await fetch(url + params.toString())

    return await response.json()
  }
}

export default openLibrary;
