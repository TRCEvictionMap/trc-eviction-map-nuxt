import { defineStore } from "pinia";
import { useMapControlsV2, type ChoroplethMetric } from "./map-controls-store-v2";

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
  
  const bgDemographics: Ref<Record<string, DemographicFeaturePropertiesV2>> = ref({});
  const bgHeatmap: Ref<Record<string, HeatmapFeatureProperties>> = ref({});

  /**
   * Aggregate eviction counts by block-group and filter by date/time
   */
  const bgHeatmapByDateTime = computed(() => {

  });

  function loadDemographics(
    source: SourceId,
    featureCollection: DemographicsFeatureCollectionV2
  ) {
    if (source === "block-group") {
      bgDemographics.value = getProperties(featureCollection)
    }
  }

  function loadHeatmap(
    source: SourceId,
    featureCollection: HeatmapFeatureCollection
  ) {
    if (source === "block-group") {
      bgHeatmap.value = getProperties(featureCollection);
    }
  }

  return { bgDemographics, bgHeatmap, loadDemographics, loadHeatmap };
});

export { useFeaturePropertiesV2 };
