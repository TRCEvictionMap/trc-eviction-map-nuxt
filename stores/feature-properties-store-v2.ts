import { defineStore } from "pinia";

import type { FeatureCollections, FeatureProperties } from "~/utils/types";
import { useMapControlsV2 } from "./map-controls-store-v2";

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
  const controls = useMapControlsV2();

  const bgChoropleth: Ref<Record<string, FeatureProperties.ChoroplethV2>> = ref({});
  const bgHeatmap: Ref<Record<string, FeatureProperties.HeatmapV2>> = ref({});
  
  const currentMonthRangeFilingCount = computed(() => {
    const [startMonth, endMonth] = controls.currentMonthRange;

    return Object.fromEntries(
      Object.entries(bgChoropleth.value).map(
        ([featureId, properties]) => [
          featureId,
          Object.entries(properties.filings).reduce(
            (accum, [filingMonth, { c: count }]) => {
              const filingEpoch = controls.monthEpochMap[filingMonth];
              const startEpoch = controls.monthEpochMap[startMonth];
              const endEpoch = controls.monthEpochMap[endMonth];

              if (filingEpoch >= startEpoch && filingEpoch <= endEpoch) {
                accum.currentWindow += count;
              }

              if (filingEpoch <= endEpoch) {
                accum.total += count;
              }

              return accum;
            },
            { currentWindow: 0, total: 0 }
          )
        ]
      )
    );
  });

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

  return { bgChoropleth, bgHeatmap, loadChoropleth, loadHeatmap, currentMonthRangeFilingCount };
});

export { useFeaturePropertiesV2 };
