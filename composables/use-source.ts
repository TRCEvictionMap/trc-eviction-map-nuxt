import mapboxgl from "mapbox-gl";
import { useSelectedFeatures } from "~/stores/selected-features-store";
import type { DataSource, FeatureId } from "utils/types";


function createLayers(source: DataSource): mapboxgl.AnyLayer[] {
    return [
        {
            source,
            id: source,
            type: "fill",
            paint: {
                "fill-color": "limegreen",
                "fill-opacity": 0.1,
            },
        },
        {
            source,
            id: `${source}-borders`,
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

function useSource(map: mapboxgl.Map, source: DataSource) {
    const selectedFeatures = useSelectedFeatures();

    const layers = createLayers(source);

    function setFeatureStateIsSelected(selectedFeatureIds: FeatureId[]) {
        map.querySourceFeatures(source).forEach(
            ({ id: featureId }) => {
                map.setFeatureState(
                    { source, id: featureId },
                    { isSelected: selectedFeatureIds.includes(featureId) }
                );
            }
        );
    }

    watch(() => selectedFeatures.items, setFeatureStateIsSelected);

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

        setFeatureStateIsSelected(selectedFeatures.items);

        map.off("click", source, selectedFeatures.handleMapClick);
    });
}

export { useSource };
