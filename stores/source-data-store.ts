import { defineStore } from "pinia";
import { SourceId } from "utils/types";

const useSourceData = defineStore("source-data", () => {
    const loadedSources = ref<Record<SourceId, boolean>>({
        "alder-districts": false,
        "block-group": false,
        "zip-codes": false,
    });

    return {
        loadedSources
    };
});

export { useSourceData };
