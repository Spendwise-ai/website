import tailwindScrollbar from "tailwind-scrollbar";

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
});

