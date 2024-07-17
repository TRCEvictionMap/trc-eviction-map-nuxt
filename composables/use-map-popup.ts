import mapboxgl from "mapbox-gl";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useFeatureState } from "~/stores/feature-state-store";

function useMapPopup() {
  const markerHeight = 50;
  const markerRadius = 10;
  const linearOffset = 10;
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

  const featureProperties = useFeaturePropertiesV2();
  const featureState = useFeatureState();

  watch(
    () => featureState.hoveredFeature,
    (featureId) => {
      const properties = featureProperties.bgChoropleth[featureId ?? ""];
      if (properties) {
        const { tr, bg,  } = properties;
        popup.setHTML(`
          <h1>Tract ${tr}, Block Group ${bg}</h1>
        `);
      }
    },
    { immediate: true }
  );

  return popup;
}

export { useMapPopup };
