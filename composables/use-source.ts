import mapboxgl from "mapbox-gl";
import { useSelectedFeatures } from "~/stores/selected-features-store";
import { useMapControls } from "~/stores/map-controls-store";
import type { SourceId } from "utils/types";

function createLayers(sourceId: SourceId): mapboxgl.AnyLayer[] {
    const { areaSource, evictionsSource } = sourceIds(sourceId);
    return [
        {
            source: areaSource,
            id: areaSource,
            type: "fill",
            paint: {
                "fill-color": "limegreen",
                "fill-opacity": 0.1,
            },
        },
        {
            source: areaSource,
            id: `${sourceId}-area-borders`,
            type: "line",
            paint: {
                "line-color": [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    "hotpink",
                    "black",
                ],
                "line-width": [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    3,
                    1,
                ],
            },
        },
        {
            source: evictionsSource,
            id: evictionsSource,
            type: "circle",
            paint: {
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["number", ["get", "filing_rate"]],
                    0, 2,
                    1, 6,
                    5, 12,
                    10, 24
                ],
                "circle-opacity": 0.6
            }
        },
    ]
}

function sourceIds(sourceId: SourceId) {
    return {
        areaSource: sourceId + "-area",
        evictionsSource: sourceId + "-evictions",
    }
}

function useSource(map: mapboxgl.Map, source: SourceId) {
    const controls = useMapControls();

    const { areaSource, evictionsSource } = sourceIds(source);

    map.on("sourcedata", (ev) => {
        if (ev.sourceId === source && ev.isSourceLoaded) {
            updateFeatureState(selectedFeatures.items);
        }
    });

    const selectedFeatures = useSelectedFeatures();

    const layers = createLayers(source);

    function updateFeatureState(selectedFeatureIds: string[]) {
        map.querySourceFeatures(areaSource).forEach(
            ({ id: featureId }) => {
                map.setFeatureState(
                    { source: areaSource, id: featureId },
                    { isSelected: selectedFeatureIds.includes(featureId?.toString() ?? "") }
                );
            }
        );
    }

    function setYearFilter() {
        map.setFilter(evictionsSource, ["==", ["string", ["get", "filing_year"]], controls.currentYear])
    }

    watch(() => selectedFeatures.items, updateFeatureState);

    watch(() => controls.currentYear, setYearFilter);

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        setYearFilter();

        map.on("click", areaSource, selectedFeatures.handleMapClick);
    });

    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer(layer.id);
        });

        selectedFeatures.clear();

        updateFeatureState(selectedFeatures.items);

        map.off("click", areaSource, selectedFeatures.handleMapClick);
    });
}

export { useSource };
