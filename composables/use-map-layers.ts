import mapboxgl from "mapbox-gl";
import { useMapControls } from "~/stores/map-controls-store";
import type { MapboxMouseEvent, SourceId, EvictionFeatureCollection } from "~/utils/types";
import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";

function layerIds(source: SourceId) {
    return {
        demographicMetrics: source + "-demographics",
        evictionMetrics: source + "-evictions" 
    }
}

function createLayers(source: SourceId): mapboxgl.AnyLayer[] {
    const { demographicMetrics, evictionMetrics } = layerIds(source);
    return [
        {
            source,
            id: demographicMetrics,
            type: "fill",
            paint: {
                "fill-color": "#ddd",
                "fill-opacity": 0.4,
                "fill-outline-color": "black",
            },
            filter: ["==", "$type", "Polygon"]
        },
        {
            source,
            id: evictionMetrics,
            type: "circle",
            paint: {
                "circle-color": "purple",
                "circle-radius": [
                    "let",
                    "year",
                    ["string", ["feature-state", "viewed_year"], "2023"],
                    [
                        "let",
                        "metric",
                        ["string", ["feature-state", "viewed_metric"], "n_filings"],
                        [
                            "interpolate",
                            ["linear"],
                            ["number", ["get", ["var", "metric"], ["get", ["var", "year"], ["get", "evictions", ["properties"]]]]],
                            0, 2,
                            1, 6,
                            5, 12,
                            10, 24
                        ]
                    ]
                ],
                "circle-opacity": 0.6
            },
            filter: ["==", "$type", "Point"],
        },
    ];
}

function useMapLayers(map: mapboxgl.Map) {
    const controls = useMapControls();

    watch(() => controls.currentDemographicMetric, (metric) => {
        
    });

    const layers = createLayers(controls.currentSource);    

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });
    });

    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer(layer.id);
        });
    });
}

























function createLayersOld(): mapboxgl.AnyLayer[] {
    const { areaSourceId, evictionsSourceId } = useCurrentSourceIds();
    return [
        {
            source: areaSourceId,
            id: areaSourceId,
            type: "fill",
            paint: {
                "fill-color": [
                    "step",
                    ["number", ["feature-state", "renter_rate"], 0],
                    "orange", .2,
                    "green", .4,
                    "red", .6,
                    "purple", .8,
                    "chartreuse"
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
    ];
}


function useMapLayersOld(map: mapboxgl.Map) {
    const controls = useMapControls();
    const settings = useSettings();
    const featureState = useFeatureState();
    const featureProperties = useFeatureProperties();
    const { baseSourceId, areaSourceId, evictionsSourceId } = useCurrentSourceIds();

    const layers = createLayersOld();

    const isLoaded = ref(false);

    map.on("sourcedata", (ev) => {
        if (ev.sourceId === areaSourceId && ev.isSourceLoaded) {
            isLoaded.value = true;
            updateSelectedFeatures(featureState.selectedFeatures);
        }
    });

    function setIsFeatureSelected(featureId: string, isSelected: boolean) {
        map.setFeatureState(
            { source: areaSourceId, id: featureId },
            { isSelected },
        );
    }

    function updateSelectedFeatures(current: string[], previous?: string[]) {
        previous
            ?.filter((featureId) => !current.includes(featureId))
            .forEach((featureId) => {
                setIsFeatureSelected(featureId, false);
            });

        current
            .filter((featureId) => !previous?.includes(featureId))
            .forEach((featureId) => {
                setIsFeatureSelected(featureId, true);
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

    watch(() => controls.currentYear, setYearFilter);

    function setupChoroplethFeatureState() {
        // const visited: Record<string, boolean> = {};
        // featureProperties.data[baseSourceId].forEach(({ id, renter_count, owner_count }) => {
        //     const _id = id.slice(4);
        //     if (!visited[_id]) {
        //         visited[_id] = true;
        //         map.setFeatureState(
        //             { source: areaSourceId, id: _id },
        //             {
        //                 renter_count,
        //                 owner_count,
        //                 household_count: renter_count + owner_count,
        //                 renter_rate: Math.round(renter_count / (renter_count + owner_count) * 100) / 100,
        //             }
        //         );
        //     }
        // });
    }

    function setYearFilter() {
        map.setFilter(evictionsSourceId, ["==", ["string", ["get", "filing_year"]], controls.currentYear]);
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

    function handleMapMousemove(ev: MapboxMouseEvent<true>) {
        if (ev.features && ev.features.length > 0) {
            const hovered = ev.features[0].id?.toString() ?? "";
            featureState.setFeatureState(hovered, "isHovered", "feature");
        }
    }

    function handleMapMouseleave(ev: MapboxMouseEvent<true>) {
        featureState.clearHoveredFeature();
    }

    watch(() => settings.options.showAlderDistricts, (showAlderDistricts) => {
        if (showAlderDistricts) {
            map.addLayer({
                source: "alder-district-area",
                id: "alder-district-area",
                type: "line",
                paint: {
                    "line-color": "black",
                }
            })
        } 
        else if (map.getLayer("alder-district-area")) {
            map.removeLayer("alder-district-area");
        }
    }, { immediate: true });

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        setYearFilter();
        setupChoroplethFeatureState();

        map.on("click", areaSourceId, handleMapClick);
        map.on("mousemove", areaSourceId, handleMapMousemove);
        map.on("mouseleave", areaSourceId, handleMapMouseleave);
    });
    
    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer((layer as mapboxgl.AnyLayer).id);
        });
        
        updateSelectedFeatures([], featureState.selectedFeatures);

        featureState.clearSelectedFeatures();
        featureState.clearHoveredFeature();
        
        map.off("click", areaSourceId, handleMapClick);
        map.off("mousemove", areaSourceId, handleMapMousemove);
        map.off("mouseleave", areaSourceId, handleMapMouseleave);
    });
}

export { useMapLayers, useMapLayersOld };
