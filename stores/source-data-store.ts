import { defineStore } from "pinia";

const useSourceData = defineStore("source-data", () => {
    const loadedSources = ref<Record<string, boolean>>({});

    return {
        loadedSources
    };
});

export { useSourceData };
