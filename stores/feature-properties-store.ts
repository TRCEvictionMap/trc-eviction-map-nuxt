import { defineStore } from "pinia";
import type { EvictionFeatureProperties, SourceId } from "utils/types";

const useFeatureProperties = defineStore("feature-properties", () => {
    const data = ref<Record<SourceId, EvictionFeatureProperties[]>>({
        "alder-districts": [],
        "block-group": [],
    });

    return { data };
});

export { useFeatureProperties };
