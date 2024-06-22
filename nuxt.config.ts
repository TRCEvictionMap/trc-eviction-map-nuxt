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
            mapboxAccessToken: "",
            mapboxStyleUrlLight: "",
            mapboxStyleUrlDark: "",

            /* BEGIN FEATURE FLAGS */
            disableChart: false,
            disableDataTableHeaderToggle: false,
            disableMultiColorFeatureOutline: false,
            /* END FEATURE FLAGS */
        },
    },
    app: {
        baseURL: process.env.BASE_URL ?? "/",
    },
});
