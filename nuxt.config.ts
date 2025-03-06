// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "@nuxtjs/supabase", "@nuxt/ui", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  supabase: {
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    clientOptions: {
      auth: {
        persistSession: true,
      },
    },
  },
  nitro: {
    prerender: {
      ignore: ["/finances", "/login"],
    },
  },
  app: {
    head: {
      title: "SpendWyze", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
