// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json"

export default defineNuxtConfig({

  devtools: { enabled: true },

  modules: [
    "@unocss/nuxt",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@nuxthub/core",
  ],

  css: ["@unocss/reset/tailwind.css"],

  colorMode: {
    classSuffix: "",
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    "/components": { redirect: "/components/accordion" },
    "/settings": { redirect: "/settings/profile" },
  },

  imports: {
    dirs: ["./lib"],
  },

  compatibilityDate: "2024-12-14",

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

  hub: {},

  nitro: {},

  runtimeConfig: {
    public: {
      version: pkg.version,

      finverseAppId: 'FINVERSE_APP_ID', // can be overridden by NUXT_API_SECRET environment variable
      finverseClientId: 'FINVERSE_CLIENT_ID', // can be overridden by NUXT_API_SECRET environment variable
      finverseClientSecret: 'FINVERSE_CLIENT_SECRET', // can be overridden by NUXT_API_SECRET environment variable
    },
  },
})
