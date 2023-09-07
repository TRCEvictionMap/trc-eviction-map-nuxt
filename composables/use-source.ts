import mapboxgl from "mapbox-gl";
import { useSelectedFeatures } from "~/stores/selected-features-store";

type Source = "alder-districts";

function createLayers(source: Source): mapboxgl.AnyLayer[] {
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

function useSource(map: mapboxgl.Map, source: Source) {
    const selectedFeatures = useSelectedFeatures();

    const layers = createLayers(source);

    watch(() => selectedFeatures.items, (selectedFeatureIds) => {
        map.querySourceFeatures(source).forEach(
            ({ id: featureId }) => {
                map.setFeatureState(
                    { source, id: featureId },
                    { isSelected: selectedFeatureIds.includes(featureId) }
                );
            }
        );
    });

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

        map.off("click", source, selectedFeatures.handleMapClick);
    });
}

export { useSource };
