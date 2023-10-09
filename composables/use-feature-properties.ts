import mapboxgl from "mapbox-gl";
import { useMapControls } from "~/stores/map-controls-store";
import { useSourceData } from "~/stores/source-data-store";
import type { SourceId } from "~/utils/types";


interface FeatureProperties {
    geog_name: string;
    owner_count: number;
    renter_count: number;
    filing_year: string;
    n_filings: number;
    filing_rate: number;
}


function getFeatureProperties(
    map: mapboxgl.Map,
    sourceId: SourceId,
    featureId: string
) {
    const controls = useMapControls();

    const feature = map.querySourceFeatures(sourceId + "-evictions").find(
        (feature) => feature.id?.toString() === `${controls.currentYear}${featureId}`
    );

    if (feature) {
        return feature.properties as FeatureProperties;
    }
}

async function useFeatureProperties(sourceId: SourceId, featureId: string) {
    const sourceData = useSourceData();
    const controls = useMapControls();

    const map = await useMap();

    const properties = ref<FeatureProperties | undefined>(
        getFeatureProperties(map, sourceId, featureId)
    );

    watch(
        [
            () => sourceData.loadedSources[sourceId + "-evictions"],
            () => controls.currentYear,
        ],
        (isLoaded) => {
            if (isLoaded) {
                properties.value = getFeatureProperties(map, sourceId, featureId);
            }
    }, { immediate: true });

    return properties;
}

export { useFeatureProperties };
