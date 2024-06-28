import { defineStore } from "pinia";

import type { FeatureCollections, FeatureProperties } from "~/utils/types";
import { useMapControlsV2 } from "./map-controls-store-v2";

function formatPercent(value: number) {
  return value < 10 ? value : Math.round(value);
}

function getProperties<
  Data extends GeoJSON.FeatureCollection,
  Props extends Data["features"][number]["properties"],
  Formatter extends (props: Props) => Props, q
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

type PolygonCenterMap = Record<string, {
  lon: number;
  lat: number;
  /** a number representing the largest difference between latitudes or longitudes */
  size: number;
}>;

const useFeaturePropertiesV2 = defineStore("feature-properties-v2", () => {  
  const controls = useMapControlsV2();

  const bgChoropleth: Ref<Record<string, FeatureProperties.ChoroplethV2>> = ref({});
  const bgHeatmap: Ref<Record<string, FeatureProperties.HeatmapV2>> = ref({});
  const bgPolygonCenter: Ref<PolygonCenterMap> = ref({});

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
                accum.runningTotal += count;
              }

              accum.total += count;

              return accum;
            },
            { currentWindow: 0, total: 0, runningTotal: 0 }
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
        pct_ai: formatPercent(props.pct_ai),
        pct_as: formatPercent(props.pct_as),
        pct_bl: formatPercent(props.pct_bl),
        pct_multi: formatPercent(props.pct_multi),
        pct_other: formatPercent(props.pct_other),
        pct_pi: formatPercent(props.pct_pi),
        pct_wh: formatPercent(props.pct_wh),
      }));

      bgPolygonCenter.value = data.features.reduce(
        (accum: PolygonCenterMap, feature) => {
          const coords = feature.geometry.coordinates.flat();

          let maxLon = 0;
          let maxLat = 0;
      
          let minLon = Infinity;
          let minLat = Infinity;
      
          for (let i = 0; i < coords.length; i++) {
            maxLon = Math.max(maxLon, Math.abs(coords[i][0]));
            maxLat = Math.max(maxLat, coords[i][1]);
      
            minLon = Math.min(minLon, Math.abs(coords[i][0]));
            minLat = Math.min(minLat, coords[i][1]);
          }
      
          // Do a little swapsies because we're assuming we're in
          // the North Western hemisphere.
          const maxLon_ = maxLon;
          maxLon = -minLon;
          minLon = -maxLon_;
    
          accum[feature.id as string] = {
            lat: maxLat - (maxLat - minLat) / 2,
            lon: minLon - (minLon - maxLon) / 2,
            size: Math.max(maxLon - minLon, maxLat - minLat),
          };

          return accum;
        },
        {}
      )
    }
  }

  function loadHeatmap(source: SourceId, data: FeatureCollections.HeatmapV2) {
    if (source === "block-group") {
      bgHeatmap.value = getProperties(data);
    }
  }

  return { bgChoropleth, bgHeatmap, bgPolygonCenter, loadChoropleth, loadHeatmap, currentMonthRangeFilingCount };
});

export { useFeaturePropertiesV2 };
