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
            mapboxAccessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            mapboxStyleUrlLight: process.env.NUXT_PUBLIC_MAPBOX_STYLE_URL_LIGHT,
            mapboxStyleUrlDark: process.env.NUXT_PUBLIC_MAPBOX_STYLE_URL_DARK,
        },
    },
    app: {
        baseURL: process.env.BASE_URL ?? "/",
    },
});
