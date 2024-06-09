import { defineStore } from "pinia";
import { useMapControlsV2, type ChoroplethMetric } from "./map-controls-store-v2";
import type { FeatureCollections, FeatureProperties } from "~/utils/types";

function roundPercent(value: number) {
  return value < 10 ? value : Math.round(value);
}

function getProperties(featureCollection: GeoJSON.FeatureCollection) {
  return Object.fromEntries(
    featureCollection.features.map(
      (feature) => [feature.id, feature.properties]
    )
  );
}

const useFeaturePropertiesV2 = defineStore("feature-properties-v2", () => {
  const controls = useMapControlsV2();
  
  const bgChoropleth: Ref<Record<string, FeatureProperties.ChoroplethV2>> = ref({});
  const bgHeatmap: Ref<Record<string, FeatureProperties.HeatmapV2>> = ref({});

  /**
   * Aggregate eviction counts by block-group and filter by date/time
   */
  const bgHeatmapByDateTime = computed(() => {

  });

  function loadChoropleth(source: SourceId, data: FeatureCollections.ChoroplethV2) {
    if (source === "block-group") {
      bgChoropleth.value = getProperties(data)
    }
  }

  function loadHeatmap(source: SourceId, data: FeatureCollections.HeatmapV2) {
    if (source === "block-group") {
      bgHeatmap.value = getProperties(data);
    }
  }

  return { bgChoropleth, bgHeatmap, loadChoropleth, loadHeatmap };
});

export { useFeaturePropertiesV2 };
