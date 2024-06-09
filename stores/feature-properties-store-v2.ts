import { defineStore } from "pinia";

import type { FeatureCollections, FeatureProperties } from "~/utils/types";

function formatPercent(value: number) {
  return value < 10 ? value : Math.round(value);
}

function getProperties<
  Data extends GeoJSON.FeatureCollection,
  Props extends Data["features"][number]["properties"],
  Formatter extends (props: Props) => Props, 
>(data: Data, format?: Formatter) {
  return Object.fromEntries(
    data.features.map(
      (feature) => [
        feature.id,
        format ? format(feature.properties as Props) : feature.properties
      ]
    )
  );
}

const useFeaturePropertiesV2 = defineStore("feature-properties-v2", () => {  
  const bgChoropleth: Ref<Record<string, FeatureProperties.ChoroplethV2>> = ref({});
  const bgHeatmap: Ref<Record<string, FeatureProperties.HeatmapV2>> = ref({});

  function loadChoropleth(source: SourceId, data: FeatureCollections.ChoroplethV2) {
    if (source === "block-group") {
      bgChoropleth.value = getProperties(data, (props) => ({
        ...props,
        rr: formatPercent(props.rr),
        rrm: formatPercent(props.rrm),
        pr: formatPercent(props.pr),
        prm: formatPercent(props.prm),
        race: Object.fromEntries(
          Object.entries(props.race).map(
            ([key, value]) => [key, formatPercent(value)]
          )
        ) as FeatureProperties.ChoroplethV2["race"],
      }));
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
