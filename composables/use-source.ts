import mapboxgl from "mapbox-gl";
import { useSelectedFeatures } from "~/stores/selected-features-store";
import type { SourceId } from "utils/types";

function createLayers(sourceId: SourceId): mapboxgl.AnyLayer[] {
    return [
        {
            source: sourceId,
            id: sourceId,
            type: "fill",
            paint: {
                "fill-color": "limegreen",
                "fill-opacity": 0.1,
            },
        },
        {
            source: sourceId,
            id: `${sourceId}-borders`,
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
    ]
}

function useSource(map: mapboxgl.Map, source: SourceId) {

    map.on("sourcedata", (ev) => {
        if (ev.sourceId === source && ev.isSourceLoaded) {
            updateFeatureState(selectedFeatures.items);
        }
    });

    const selectedFeatures = useSelectedFeatures();

    const layers = createLayers(source);

    function updateFeatureState(selectedFeatureIds: string[]) {
        map.querySourceFeatures(source).forEach(
            ({ id: featureId }) => {
                map.setFeatureState(
                    { source, id: featureId },
                    { isSelected: selectedFeatureIds.includes(featureId?.toString() ?? "") }
                );
            }
        );
    }

    watch(() => selectedFeatures.items, updateFeatureState);

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        map.on("click", source, selectedFeatures.handleMapClick);
    });

    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer(layer.id);
        });

        selectedFeatures.clear();

        updateFeatureState(selectedFeatures.items);

        map.off("click", source, selectedFeatures.handleMapClick);
    });
}

export { useSource };
