import { defineStore } from "pinia";

const LOCAL_STORAGE_KEY = "trcmap-settings"

const defaultOptions = {
    verticalDetailCards: true,
    showAlderDistricts: false
}

type Options = typeof defaultOptions;

function persistOptions(options: Options) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
}

const useSettings = defineStore("settings", () => {
    const showSettingsMenu = ref(false);

    const options = reactive({} as Options);

    function loadOptions() {
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.keys(defaultOptions).forEach((key) => {
                    options[key as keyof Options] = parsed[key] ?? defaultOptions[key as keyof Options];
                });
            }
        }
    }

    onMounted(loadOptions);

    watch(options, persistOptions);

    return {
        showSettingsMenu,
        options,
    };
});

export { useSettings };
