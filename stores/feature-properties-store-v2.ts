import { defineStore } from "pinia";

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
  const bgDemographics: Ref<Record<string, DemographicFeaturePropertiesV2>> = ref({});

  function loadDemographics(
    source: SourceId,
    featureCollection: DemographicsFeatureCollectionV2
  ) {
    if (source === "block-group") {
      bgDemographics.value = getProperties(featureCollection)
    }
  }

  const bgHeatmap: Ref<Record<string, HeatmapFeatureProperties>> = ref({});

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
