// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      homeUrl: process.env.BACKEND_URL,
      apiBase: process.env.BACKEND_URL + '/api',
      //homeUrl: 'http://localhost:3000',
      //apiBase: 'http://localhost:8080/api',
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    }
  },
  plugins: [
    '@/plugins/getHoliday.ts',
    '@/plugins/getSession.ts',
  ],
  vite: {
    server: {
      proxy: {
        "/api/": {
          target: process.env.BACKEND_URL + '/',
          secure: false
        }
      }
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    '@/assets/css/style.css',
    '@/assets/css/root.css',
    '@/assets/css/flatpickr.css',
    '@/assets/css/buttons.css',
    '@/assets/css/scrollbar.css',
  ],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com"
        },
        {
          rel: 'stylesheet',
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&display=swap"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Carter+One&display=swap"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Knewave&family=Noto+Sans+JP:wght@100..900&family=Potta+One&display=swap"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dela+Gothic+One&family=Fjalla+One&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Knewave&family=Noto+Sans+JP:wght@100..900&family=Potta+One&display=swap"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dela+Gothic+One&family=Fjalla+One&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Knewave&family=Kosugi+Maru&family=Noto+Sans+JP:wght@100..900&family=Potta+One&display=swap"
        },
        {
          rel: 'stylesheet',
          href: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600&display=swap"
        }
      ]
    }
  }
})
