// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
            mapboxStyleUrl: "",
        },
    },
    app: {
        baseURL: process.env.BASE_URL ?? "/",
    },
});
