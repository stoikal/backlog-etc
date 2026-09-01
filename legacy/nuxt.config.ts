// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  runtimeConfig: {
    public: {
      appName: '',
      appVersion: '',
      appEmail: ''
    }
  },
  hooks: {
    'pages:extend'(pages) {
        pages.push(
          {
            name: 'games-backlog',
            path: '/games',
            file: '~/pages/backlog/games.vue'
          },
          {
            name: 'reading-backlog',
            path: '/reading',
            file: '~/pages/backlog/reading.vue'
          },
        )
    }
}
})