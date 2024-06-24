// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    content: {
        markdown: {
            tags: {
                span: "CustomSpan",
            }
        }
    },
    nitro: {
        prerender: {
            crawlLinks: false,
        }
    },
    devtools: { enabled: false },
    modules: [
        "@pinia/nuxt",
        "@nuxt/image",
        "@nuxt/content",
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
            /* BEGIN MAPBOX */
            mapboxAccessToken: "",
            mapboxStyleUrlLight: "",
            mapboxStyleUrlDark: "",
            /* END MAPBOX */
            
            /* BEGIN FEATURE FLAGS */
            disableChart: true,
            disableDataTableHeaderToggle: false,
            disableMultiColorFeatureOutline: false,
            /* END FEATURE FLAGS */
        },
    },
    app: {
        baseURL: process.env.BASE_URL ?? "/",
    },
});
