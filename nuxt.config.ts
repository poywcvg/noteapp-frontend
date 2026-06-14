export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/eslint",
    "@nuxt/test-utils",
    "@bubblesortt/nuxt-es-toolkit",
    "@dargmuesli/nuxt-cookie-control",
    "@element-plus/nuxt",
    "@askdoppler/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@nuxt/fonts",
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
