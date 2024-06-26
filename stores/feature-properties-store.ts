import { defineStore } from "pinia";
import type { EvictionFeatureProperties, DemographicFeatureProperties, SourceId, EvictionFeatureCollection } from "@/utils/types";

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

interface FeatureIdMap {
    demographic: string[];
    eviction: string[];
}

const useFeatureProperties = defineStore("feature-properties", () => {
    const data = ref<Record<SourceId, Record<string, DemographicFeatureProperties | EvictionFeatureProperties>>>({
        "block-group": {},
    });

    const featureIds = computed(() =>
        Object.keys(data.value).reduce(
            (accum: Record<SourceId, FeatureIdMap>, source) => ({
                ...accum,
                [source]: Object.keys(data.value[source as SourceId]).reduce(
                    (accum: FeatureIdMap, featureId) =>
                        featureId.startsWith("d_")
                            ? { ...accum, demographic: accum.demographic.concat(featureId) }
                            : { ...accum, eviction: accum.eviction.concat(featureId) }
                    ,
                    { demographic: [], eviction: [] }
                )
            }),
            {} as Record<SourceId, FeatureIdMap>
        )
    );

    function roundPercent(value: number) {
        return value < 10 ? value : Math.round(value);
    }

    function getFeatureProperties(source: SourceId, featureId: string): FeatureProperties | undefined {
        if (typeof data.value[source][featureId] !== "undefined") {
            const root = featureId.replace(/^\w_/, "");
            const {
                evictions,
                ...evictionProperties
            } = data.value[source][`e_${root}`] as EvictionFeatureProperties;
            const {
                renter_rate,
                renter_rate_moe,
                poverty_rate,
                poverty_rate_moe,
                race,
                ...demographicProperties
            } = data.value[source][`d_${root}`] as DemographicFeatureProperties;
            return {
                ...evictionProperties,
                ...demographicProperties,
                renter_rate: roundPercent(renter_rate),
                renter_rate_moe: roundPercent(renter_rate_moe),
                poverty_rate: roundPercent(poverty_rate),
                poverty_rate_moe: roundPercent(poverty_rate_moe),
                race: Object.entries(race).reduce(
                    (accum: typeof race, [key, value]) => ({
                        ...accum,
                        [key as keyof typeof race]: roundPercent(value),
                    }), {} as typeof race
                ),
                evictions: Object.entries(evictions).reduce(
                    (accum: typeof evictions, [year, { filing_rate, n_filings }]) => ({
                        ...accum,
                        [year]: {
                            n_filings,
                            filing_rate: roundPercent(filing_rate),
                        },
                    }), {}
                ),
            } as FeatureProperties;
        }
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

    return { data, featureIds, loadData, getFeatureProperties };
});

export { useFeatureProperties, isEvictionFeatureProperties, isDemographicFeatureProperties };
export type { FeatureProperties };
