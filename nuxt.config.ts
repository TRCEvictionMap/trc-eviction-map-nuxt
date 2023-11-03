// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    nitro: {
        prerender: {
            crawlLinks: false,
        }
    },
    devtools: { enabled: false },
    modules: [
        "@pinia/nuxt"
    ],
    css: [
        "~/assets/css/main.css"
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            mapboxAccessToken: "",
            mapboxStyleUrlLight: "",
            mapboxStyleUrlDark: "",
        },
    },
    app: {
        baseURL: process.env.BASE_URL ?? "/",
    },
});
