import mapboxgl from "mapbox-gl";
import { useMapControls } from "~/stores/map-controls-store";
import type { DemographicMetric, EvictionMetric } from "~/stores/map-controls-store";
import type { MapboxMouseEvent, SourceId, EvictionFeatureCollection } from "~/utils/types";
import { useFeatureState } from "~/stores/feature-state-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";

function createLayers(source: SourceId): mapboxgl.AnyLayer[] {
    const {
        evictionsLayerId,
        demographicsLayerId,
        demographicsShadingLayerId,
        demographicsBorderLayerId,
    } = useLayerIds(source);

    return [
        {
            source,
            id: demographicsLayerId,
            type: "fill",
            paint: {
                "fill-opacity": 0,
            },
            filter: ["==", "$type", "Polygon"]
        },
        {
            source,
            id: demographicsShadingLayerId,
            type: "fill",
            paint: {
                "fill-opacity": 0.5
            }
        },
        {
            source,
            id: demographicsBorderLayerId,
            type: "line",
            filter: ["==", "$type", "Polygon"],
            paint: {
                "line-width": [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    4,
                    1,
                ],
                "line-color": [
                    "case",
                    ["boolean", ["feature-state", "isHovered"], false],
                    "black",
                    "gray"
                ]
            }
        },
        {
            source,
            id: evictionsLayerId,
            type: "circle",
            paint: {
                "circle-color": "rgb(255, 75, 50)",
                "circle-opacity": 0.8,
                "circle-stroke-color": "black",
                "circle-stroke-width": 1
            },
            filter: ["==", "$type", "Point"],
        },
    ];
}

function useMapLayers(map: mapboxgl.Map) {
    const controls = useMapControls();
    const featureState = useFeatureState();
    const featureProperties = useFeatureProperties();
    const interpolatedValues = useInterpolatedValues();

    const { demographicsLayerId, demographicsShadingLayerId, evictionsLayerId } = useLayerIds(controls.currentSource);

    watch(
        () => featureState.selectedFeatures,
        updateSelectedFeatures,
        { immediate: true }
    );

    watch(
        [
            () => controls.currentEvictionMetric,
            () => controls.currentYear,
        ],
        updateEvictionsPaintProperties,
        { immediate: true }
    );

    watch(
        [
            () => controls.currentDemographicMetric,
        ],
        updateDemographicsPaintProperties,
        { immediate: true }
    );

    watch(() => featureState.hoveredFeature, (current, prev) => {
        if (prev) {
            map.setFeatureState(
                { source: controls.currentSource, id: prev },
                { isHovered: false }
            );
        }
        if (current) {
            map.setFeatureState(
                { source: controls.currentSource, id: current },
                { isHovered: true }
            );
        }
    });

    const layers = createLayers(controls.currentSource);

    function updateIsSelected(featureId: string, isSelected: boolean) {
        map.setFeatureState(
            { source: controls.currentSource, id: featureId },
            { isSelected },
        );
    }

    function updateSelectedFeatures(current: string[], previous?: string[]) {
        previous
            ?.filter((featureId) => !current.includes(featureId))
            .forEach((featureId) => {
                updateIsSelected(featureId, false);
            });

        current
            .filter((featureId) => !previous?.includes(featureId))
            .forEach((featureId) => {
                updateIsSelected(featureId, true);
            });
    }

    const interpolatedDemographicValues = computed(
        (): Record<DemographicMetric, (number | string)[]> => ({
            none: [],
            renter_count: Object.entries(interpolatedValues.renterCountValues).flatMap(
                ([step, color]) => [Number.parseFloat(step), color]
            ),
            renter_rate: Object.entries(interpolatedValues.renterRateValues).flatMap(
                ([step, color]) => [Number.parseFloat(step), color]
            ),
        })
    );

    const interpolatedEvictionValues = computed(
        (): Record<EvictionMetric, (number | string)[]> => ({
            none: [],
            filing_rate: Object.entries(interpolatedValues.filingRateValues).flatMap(
                ([step, size]) => [Number.parseFloat(step), size]
            ),
            n_filings: Object.entries(interpolatedValues.filingCountValues).flatMap(
                ([step, size]) => [Number.parseFloat(step), size]
            ),
        })
    )

    function updateDemographicsPaintProperties([metric]: [DemographicMetric]) {
        if (map.getLayer(demographicsShadingLayerId)) {
            if (metric !== "none") {
                map.setLayoutProperty(demographicsShadingLayerId, "visibility", "visible");
                map.setPaintProperty(
                    demographicsShadingLayerId,
                    "fill-color",
                    [
                        "interpolate",
                        ["linear"],
                        ["number", ["get", metric, ["properties"]]],
                        ...interpolatedDemographicValues.value[metric]
                    ],
                );
            }
            else {
                map.setLayoutProperty(demographicsShadingLayerId, "visibility", "none");
            }
        }
    }

    function updateEvictionsPaintProperties([metric, year]: [EvictionMetric, string]) {
        if (map.getLayer(evictionsLayerId)) {
            if (metric !== "none") {
                map.setLayoutProperty(evictionsLayerId, "visibility", "visible");
                map.setPaintProperty(
                    evictionsLayerId,
                    "circle-radius",
                    [
                        "interpolate",
                        ["linear"],
                        ["number", ["get", metric, ["get", year, ["get", "evictions", ["properties"]]]]],
                        ...interpolatedEvictionValues.value[metric]
                    ]
                );
            }
            else {
                map.setLayoutProperty(evictionsLayerId, "visibility", "none");
            }
        
        }
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

    function handleMapMouseleave(ev: MapboxMouseEvent<true>) {
        featureState.clearHoveredFeature();
    }

    function handleMapMousemove(ev: MapboxMouseEvent<true>) {
        if (ev.features && ev.features.length > 0) {
            const hovered = ev.features[0].id?.toString() ?? "";
            featureState.setFeatureState(hovered, "isHovered", "feature");
        }
    }

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        updateEvictionsPaintProperties([
            controls.currentEvictionMetric,
            controls.currentYear
        ]);

        updateDemographicsPaintProperties([
            controls.currentDemographicMetric
        ])

        map.on("click", demographicsLayerId, handleMapClick);
        map.on("mousemove", demographicsLayerId, handleMapMousemove);
        map.on("mouseleave", demographicsLayerId, handleMapMouseleave);
    });
    
    onBeforeUnmount(() => {
        layers.forEach((layer) => {
            map.removeLayer(layer.id);
        });

        updateSelectedFeatures([], featureState.selectedFeatures);

        featureState.clearSelectedFeatures();
        featureState.clearHoveredFeature();

        map.off("click", demographicsLayerId, handleMapClick);
        map.off("mousemove", demographicsLayerId, handleMapMousemove);
        map.off("mouseleave", demographicsLayerId, handleMapMouseleave);
    });
}

























// function createLayersOld(): mapboxgl.AnyLayer[] {
//     const { areaSourceId, evictionsSourceId } = useCurrentSourceIds();
//     return [
//         {
//             source: areaSourceId,
//             id: areaSourceId,
//             type: "fill",
//             paint: {
//                 "fill-color": [
//                     "step",
//                     ["number", ["feature-state", "renter_rate"], 0],
//                     "orange", .2,
//                     "green", .4,
//                     "red", .6,
//                     "purple", .8,
//                     "chartreuse"
//                 ],
//                 "fill-outline-color": "black",
//                 "fill-opacity": [
//                     "case",
//                     ["boolean", ["feature-state", "isHovered"], false],
//                     0.4,
//                     0.2,
//                 ],
//             },
//         },
//         {
//             source: areaSourceId,
//             id: `${areaSourceId}-borders`,
//             type: "line",
//             paint: {
//                 "line-color": [
//                     "case",
//                     ["boolean", ["feature-state", "isSelected"], false],
//                     "goldenrod",
//                     "black",
//                 ],
//                 "line-width": [
//                     "case",
//                     ["boolean", ["feature-state", "isSelected"], false],
//                     2,
//                     0,
//                 ],
//             },
//         },
//         {
//             source: evictionsSourceId,
//             id: evictionsSourceId,
//             type: "circle",
//             paint: {
//                 "circle-radius": [
//                     "interpolate",
//                     ["linear"],
//                     ["number", ["get", "filing_rate"]],
//                     0, 2,
//                     1, 6,
//                     5, 12,
//                     10, 24
//                 ],
//                 "circle-opacity": 0.6
//             }
//         },
//     ];
// }


// function useMapLayersOld(map: mapboxgl.Map) {
//     const controls = useMapControls();
//     const settings = useSettings();
//     const featureState = useFeatureState();
//     const featureProperties = useFeatureProperties();
//     const { baseSourceId, areaSourceId, evictionsSourceId } = useCurrentSourceIds();

//     const layers = createLayersOld();

//     const isLoaded = ref(false);

//     map.on("sourcedata", (ev) => {
//         if (ev.sourceId === areaSourceId && ev.isSourceLoaded) {
//             isLoaded.value = true;
//             updateSelectedFeatures(featureState.selectedFeatures);
//         }
//     });

//     function setIsFeatureSelected(featureId: string, isSelected: boolean) {
//         map.setFeatureState(
//             { source: areaSourceId, id: featureId },
//             { isSelected },
//         );
//     }

//     function updateSelectedFeatures(current: string[], previous?: string[]) {
//         previous
//             ?.filter((featureId) => !current.includes(featureId))
//             .forEach((featureId) => {
//                 setIsFeatureSelected(featureId, false);
//             });

//         current
//             .filter((featureId) => !previous?.includes(featureId))
//             .forEach((featureId) => {
//                 setIsFeatureSelected(featureId, true);
//             });
//     }

//     watch(() => featureState.selectedFeatures, updateSelectedFeatures);

//     watch(() => featureState.hoveredFeature, (current, prev) => {
//         if (prev) {
//             map.setFeatureState(
//                 { source: areaSourceId, id: prev },
//                 { isHovered: false }
//             );
//         }
//         if (current) {
//             map.setFeatureState(
//                 { source: areaSourceId, id: current },
//                 { isHovered: true }
//             );
//         }
//     });

//     watch(() => controls.currentYear, setYearFilter);

//     function setupChoroplethFeatureState() {
//         // const visited: Record<string, boolean> = {};
//         // featureProperties.data[baseSourceId].forEach(({ id, renter_count, owner_count }) => {
//         //     const _id = id.slice(4);
//         //     if (!visited[_id]) {
//         //         visited[_id] = true;
//         //         map.setFeatureState(
//         //             { source: areaSourceId, id: _id },
//         //             {
//         //                 renter_count,
//         //                 owner_count,
//         //                 household_count: renter_count + owner_count,
//         //                 renter_rate: Math.round(renter_count / (renter_count + owner_count) * 100) / 100,
//         //             }
//         //         );
//         //     }
//         // });
//     }

//     function setYearFilter() {
//         map.setFilter(evictionsSourceId, ["==", ["string", ["get", "filing_year"]], controls.currentYear]);
//     }

//     function handleMapClick(ev: MapboxMouseEvent<true>) {
//         if (ev.features && ev.features.length > 0) {
//             const justClicked = ev.features[0].id?.toString() ?? "";
//             featureState.setFeatureState(
//                 justClicked,
//                 "isSelected",
//                 !featureState.selectedFeatures.includes(justClicked)
//             );
//         }
//     }

//     function handleMapMousemove(ev: MapboxMouseEvent<true>) {
//         if (ev.features && ev.features.length > 0) {
//             const hovered = ev.features[0].id?.toString() ?? "";
//             featureState.setFeatureState(hovered, "isHovered", "feature");
//         }
//     }

//     function handleMapMouseleave(ev: MapboxMouseEvent<true>) {
//         featureState.clearHoveredFeature();
//     }

//     watch(() => settings.options.showAlderDistricts, (showAlderDistricts) => {
//         if (showAlderDistricts) {
//             map.addLayer({
//                 source: "alder-district-area",
//                 id: "alder-district-area",
//                 type: "line",
//                 paint: {
//                     "line-color": "black",
//                 }
//             })
//         } 
//         else if (map.getLayer("alder-district-area")) {
//             map.removeLayer("alder-district-area");
//         }
//     }, { immediate: true });

//     onMounted(() => {
//         layers.forEach((layer) => {
//             map.addLayer(layer);
//         });

//         setYearFilter();
//         setupChoroplethFeatureState();

//         map.on("click", areaSourceId, handleMapClick);
//         map.on("mousemove", areaSourceId, handleMapMousemove);
//         map.on("mouseleave", areaSourceId, handleMapMouseleave);
//     });
    
//     onBeforeUnmount(() => {
//         layers.forEach((layer) => {
//             map.removeLayer((layer as mapboxgl.AnyLayer).id);
//         });
        
//         updateSelectedFeatures([], featureState.selectedFeatures);

//         featureState.clearSelectedFeatures();
//         featureState.clearHoveredFeature();
        
//         map.off("click", areaSourceId, handleMapClick);
//         map.off("mousemove", areaSourceId, handleMapMousemove);
//         map.off("mouseleave", areaSourceId, handleMapMouseleave);
//     });
// }

export { useMapLayers };
