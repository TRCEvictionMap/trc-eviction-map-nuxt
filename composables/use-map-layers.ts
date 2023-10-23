import mapboxgl from "mapbox-gl";
import { useMapControls } from "~/stores/map-controls-store";
import type { MapboxMouseEvent, EvictionFeatureProperties } from "~/utils/types";
import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";

function createLayers(): mapboxgl.AnyLayer[] {
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


function useMapLayers(map: mapboxgl.Map) {
    const controls = useMapControls();
    const settings = useSettings();
    const featureState = useFeatureState();
    const featureProperties = useFeatureProperties();
    const { baseSourceId, areaSourceId, evictionsSourceId } = useCurrentSourceIds();

    const layers = createLayers();

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

    function setYearFilter() {
        map.setFilter(evictionsSourceId, ["==", ["string", ["get", "filing_year"]], controls.currentYear]);
        featureProperties.data[baseSourceId].forEach(({ filing_year, n_filings, id, renter_count, owner_count }) => {
            if (filing_year === controls.currentYear) {
                map.setFeatureState(
                    { source: areaSourceId, id: id.slice(4) },
                    {
                        n_filings,
                        renter_count,
                        owner_count,
                        household_count: renter_count + owner_count,
                        renter_rate: Math.round(renter_count / (renter_count + owner_count) * 100) / 100,
                    }
                );
            }
        });
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

    watch(() => settings.showAlderDistricts, (showAlderDistricts) => {
        if (showAlderDistricts) {
            map.addLayer({
                source: "alder-district-area",
                id: "alder-district-area",
                type: "line",
                paint: {
                    "line-color": "black",
                }
            })
        } else {
            try {
                map.removeLayer("alder-district-area");
            } catch (error) {}
        }
    }, { immediate: true });

    onMounted(() => {
        layers.forEach((layer) => {
            map.addLayer(layer);
        });

        // addChoropleth(featureProperties.data[baseSourceId])

        setYearFilter();

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

export { useMapLayers };
