import mapboxgl from "mapbox-gl";
import { useSourceData } from "~/stores/source-data-store";
import type { SourceId } from "~/utils/types";


interface FeatureProperties {
    feature_name: string;
    owner_count: number;
    renter_count: number;
    evictions: {
        n_filings: number;
        filing_year: string;
    }[]
}


function getFeatureProperties(
    map: mapboxgl.Map,
    sourceId: SourceId,
    featureId: string
) {
    const feature = map.querySourceFeatures(sourceId).find(
        (feature) => feature.id?.toString() === featureId
    );
    
    if (feature) {
        const { properties } = feature;
        return {
            ...properties,
            evictions: JSON.parse(properties?.evictions),
        } as FeatureProperties;
    }
}

async function useFeatureProperties(sourceId: SourceId, featureId: string) {
    const sourceData = useSourceData();
    const map = await useMap();

    const properties = ref<FeatureProperties | undefined>(
        getFeatureProperties(map, sourceId, featureId)
    );

    watch(() => sourceData.loadedSources[sourceId], (isLoaded) => {
        if (isLoaded) {
            properties.value = getFeatureProperties(map, sourceId, featureId);
        }
    }, { immediate: true });

    return properties;
}

export { useFeatureProperties };
