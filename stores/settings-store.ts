import { defineStore } from "pinia";

const LOCAL_STORAGE_KEY = "trcmap-settings"

const defaultOptions = {
    verticalDetailCards: true,
    showAlderDistricts: false,
    detailCardListUnderlineItems: false,
    showDataTable: false,
    showBottomPanel: false,
}

type Options = typeof defaultOptions;

function persistOptions(options: Options) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
}

const useSettings = defineStore("settings", () => {
    const showDialog = ref(false);

    const options = reactive(defaultOptions as Options);

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

    watch(options, persistOptions);

    return { showDialog, options, loadOptions };
});

export { useSettings };
