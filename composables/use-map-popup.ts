import mapboxgl from "mapbox-gl";
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

function useMapPopup() {

  const flags = useFeatureFlags();

  if (flags.disableMapPopups) {
    return new mapboxgl.Popup();
  }

  const featureProperties = useFeaturePropertiesV2();
  const featureState = useFeatureState();
  const controls = useMapControlsV2();

  const markerHeight = 15;
  const markerRadius = 10;
  const linearOffset = 0;
  const popupOffsets: Record<string, [number, number]> = {
    "top": [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    "bottom": [0, -markerHeight],
    "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    "left": [markerRadius, (markerHeight - markerRadius) * -1],
    "right": [-markerRadius, (markerHeight - markerRadius) * -1]
  };

  const popup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false,
    offset: popupOffsets,
    maxWidth: "300px",
  });

  const dateRange = computed(() => {
    const { currentMonthRangeHumanReadable } = controls;
    if (currentMonthRangeHumanReadable) {
      const { start, end } = currentMonthRangeHumanReadable;
      if (start.y === end.y && start.m === end.m) {
        return `during ${start.m} ${start.y}`;
      }
      return `between ${start.m} ${start.y} and ${end.m} ${end.y}`;
    }
    return "";
  });

  watch(
    () => featureState.hoveredFeature,
    (featureId) => {
      if (featureId) {
        const filings = featureProperties.currentMonthRangeFilingCount[featureId];
        const properties = featureProperties.bgChoropleth[featureId];
        const { tr, bg } = properties;
        popup.setHTML(`
          <p>
            <span class="font-semibold">${filings.currentWindow}</span> eviction${filings.currentWindow === 1 ? "" : "s"}
            were filed in Block Group <span class="font-semibold">${tr}.${bg}</span> ${dateRange.value}.
          </p>
        `);
      }
    },
    { immediate: true }
  );

  return popup;
}

export { useMapPopup };
