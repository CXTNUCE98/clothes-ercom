// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    'boxicons/css/boxicons.min.css',
    'element-plus/dist/index.css',
    '~/assets/css/inputs.css'
  ],
  elementPlus: {
    importStyle: 'css',
    themes: ['dark']
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001/api'
    }
  },
  app: {
    head: {
      title: 'Clothes E-commerce',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Website bán hàng thời trang' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
}) 