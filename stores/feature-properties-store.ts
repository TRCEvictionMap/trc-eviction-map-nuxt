import { defineStore } from "pinia";
import type { EvictionFeatureProperties, DemographicFeatureProperties, SourceId, EvictionFeatureCollection } from "utils/types";

type FeatureProperties = EvictionFeatureProperties & DemographicFeatureProperties;

function isFeatureProperties(data: unknown): data is EvictionFeatureProperties | DemographicFeatureProperties {
    return (
        typeof data !== "undefined" &&
        Object.prototype.hasOwnProperty.call(data, "id") &&
        Object.prototype.hasOwnProperty.call(data, "region")
    );
}

function isEvictionFeatureProperties(data: unknown): data is EvictionFeatureProperties {
    if (isFeatureProperties(data)) {
        const { id } = data;
        return id.startsWith("e_")
    }
    return false;
}


function isDemographicFeatureProperties(data: unknown): data is EvictionFeatureProperties {
    if (isFeatureProperties(data)) {
        const { id } = data;
        return id.startsWith("d_")
    }
    return false;
}

const useFeatureProperties = defineStore("feature-properties", () => {
    const data = ref<Record<SourceId, Record<string, DemographicFeatureProperties | EvictionFeatureProperties>>>({
        "alder-district": {},
        "block-group": {},
    });

    function getFeatureProperties(source: SourceId, featureId: string): FeatureProperties {
        const root = featureId.replace(/^\w_/, "");
        return {
            ...data.value[source][`e_${root}`],
            ...data.value[source][`d_${root}`],
        } as FeatureProperties;
    }

    function loadData(source: SourceId, featureCollection: EvictionFeatureCollection): string[] {
        let years: string[] = [];

        featureCollection.features.forEach((feature) => {
            data.value[source][feature.id as string] = feature.properties as DemographicFeatureProperties | EvictionFeatureProperties;
            if (years.length === 0 && isEvictionFeatureProperties(feature.properties)) {
                years = Object.keys(feature.properties.evictions);
            }
        });

        return years;
    }

    return { data, loadData, getFeatureProperties };
});

export { useFeatureProperties, isEvictionFeatureProperties, isDemographicFeatureProperties };
