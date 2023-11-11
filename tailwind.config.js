/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                "trc-blue": {
                    "50": "#f2f8fd",
                    "100": "#e4effa",
                    "200": "#c2def5",
                    "300": "#8dc4ec",
                    "400": "#50a7e0",
                    "500": "#298cce",
                    "600": "#1a6eaf",
                    "700": "#17588d",
                    "800": "#174b75",
                    "900": "#184062",
                    "950": "#143351",
                },
                "trc-orange": {
                    "50": "#fef6ee",
                    "100": "#fdead7",
                    "200": "#fbd0ad",
                    "300": "#f8af79",
                    "400": "#f48545",
                    "500": "#f1631e",
                    "600": "#e24a14",
                    "700": "#bb3613",
                    "800": "#952c17",
                    "900": "#782716",
                    "950": "#411009",
                },

            }
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
}

