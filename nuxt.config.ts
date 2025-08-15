// https://nuxt.com/docs/api/configuration/nuxt-config
import pkg from "./package.json";

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@unocss/nuxt",
    "shadcn-nuxt",
    "@vueuse/nuxt",
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

  routeRules: {
    "/settings": { redirect: "/settings/profile" },
    // Generated at build time for SEO purpose
    // "/": { prerender: true },
    // // Cached for 1 hour
    // "/api/*": { cache: { maxAge: 60 * 60 } },
    // Redirection to avoid 404
    // "/old-page": { redirect: { to: "/new-page", statusCode: 302 },
    // },
  },

  imports: {
    dirs: ["./lib"],
  },

  compatibilityDate: "2024-12-14",

  supabase: {
    redirectOptions: {
      login: "/login",

      callback: "/confirm",
      include: undefined,
      exclude: ["/register"],
      saveRedirectToCookie: false,
    },
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
    clientOptions: {
      auth: {
        persistSession: true,
      },
    },
  },

  hub: {
    database: true,
  },

  nitro: {
    experimental: {
      openAPI: true,
      // tasks: true,
    },
  },

  // auth: {
  //   // ... other auth config
  //   exclude: ["/auth/signup"], // Exclude the sign-up page from authentication
  // },
  runtimeConfig: {
    finverseAppId: "FINVERSE_APP_ID", // can be overridden by NUXT_API_SECRET environment variable
    finverseClientId: "FINVERSE_CLIENT_ID", // can be overridden by NUXT_API_SECRET environment variable
    finverseClientSecret: "FINVERSE_CLIENT_SECRET", // can be overridden by NUXT_API_SECRET environment variable
    public: {
      version: pkg.version,
    },
  },
  devServer: {
    // https: {
    //   key: "./server.key",
    //   cert: "./server.crt",
    // },
  },
});
