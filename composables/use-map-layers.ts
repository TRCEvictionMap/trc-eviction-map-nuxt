import mapboxgl from "mapbox-gl";
import { useMapControls } from "~/stores/map-controls-store";
import type { MapboxMouseEvent } from "~/utils/types";
import { useFeatureState } from "~/stores/feature-state-store";

function createLayers(): mapboxgl.AnyLayer[] {
    const { areaSourceId, evictionsSourceId } = useCurrentSourceIds();
    return [
        {
            source: areaSourceId,
            id: areaSourceId,
            type: "fill",
            paint: {
                "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "isHovered"], false],
                    "orange",
                    "gold",
                ],
                "fill-outline-color": "black",
                "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "isHovered"], false],
                    0.4,
                    0.2,
                ],
            },
        },
        {
            source: areaSourceId,
            id: `${areaSourceId}-borders`,
            type: "line",
            paint: {
                "line-color": [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    "goldenrod",
                    "black",
                ],
                "line-width": [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    2,
                    0,
                ],
            },
        },
        {
            source: evictionsSourceId,
            id: evictionsSourceId,
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


function useMapLayers(map: mapboxgl.Map) {
    const controls = useMapControls();
    const featureState = useFeatureState();
    const { areaSourceId, evictionsSourceId } = useCurrentSourceIds();

    const layers = createLayers();

    map.on("sourcedata", (ev) => {
        if (ev.sourceId === areaSourceId && ev.isSourceLoaded) {
            updateSelectedFeatures(featureState.selectedFeatures);
        }
    });

    function updateSelectedFeatures(selectedFeatureIds: string[]) {
        map.querySourceFeatures(areaSourceId).forEach(({ id: featureId }) => {
            map.setFeatureState(
                { source: areaSourceId, id: featureId },
                { isSelected: selectedFeatureIds.includes(featureId?.toString() ?? "") }
            );
        });
    }

    watch(() => featureState.selectedFeatures, updateSelectedFeatures);

    watch(() => featureState.hoveredFeature, (current, prev) => {
        if (prev) {
            map.setFeatureState(
                { source: areaSourceId, id: prev },
                { isHovered: false }
            );
        }
        if (current) {
            map.setFeatureState(
                { source: areaSourceId, id: current },
                { isHovered: true }
            );
        }
    });

    watch(() => controls.currentYear, setYearFilter, {
        flush: "pre"
    });

    function setYearFilter() {
        map.setFilter(evictionsSourceId, ["==", ["string", ["get", "filing_year"]], controls.currentYear])
    }

    function handleMapClick(ev: MapboxMouseEvent<true>) {
        if (ev.features && ev.features.length > 0) {
            const justClicked = ev.features[0].id?.toString() ?? "";
            featureState.setFeatureState(
                justClicked,
                "isSelected",
                !featureState.selectedFeatures.includes(justClicked)
            );
        }
    }

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        setYearFilter();

        map.on("click", areaSourceId, handleMapClick);
    });

    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer(layer.id);
        });

        featureState.clearSelectedFeatures();
        featureState.clearHoveredFeature();

        map.off("click", areaSourceId, handleMapClick);
    });
}

export { useMapLayers };
