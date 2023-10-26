import { defineStore } from "pinia";
import type { EvictionFeatureProperties, DemographicFeatureProperties, SourceId } from "utils/types";

interface FeatureProperties {
    demographics: DemographicFeatureProperties[];
    evictions: EvictionFeatureProperties[];
}

const useFeatureProperties = defineStore("feature-properties", () => {
    const data = ref<Record<SourceId, FeatureProperties>>({
        "alder-district": { demographics: [], evictions: [] },
        "block-group": { demographics: [], evictions: [] },
    });

    return { data };
});

export { useFeatureProperties };
