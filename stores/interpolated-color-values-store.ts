import { defineStore } from "pinia";
import { useFeaturePropertiesV2 } from "./feature-properties-store-v2";
import { useMapControlsV2, type ChoroplethMetric } from "./map-controls-store-v2";

const BLUE = [
  "#f7fbff",
  "#deebf7",
  "#c6dbef",
  "#9ecae1",
  "#6baed6",
  "#4292c6",
  "#2171b5",
  "#08519c",
  "#08306b",
];

function interpolateColor(maxValue: number, gradient: string[]) {
  return gradient.flatMap((color, step) => [Math.round(maxValue * (step / gradient.length)), color])
}

// function interpolateRange(maxValue: number, range: number[]): [number, number][] {
//   return range.map((value, step) => [
//     Math.round(maxValue * (step / range.length)),
//     value
//   ]);
// }

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const featureProperties = useFeaturePropertiesV2();

  // const heatmap = computed((): [number, number][] => {

  //   /**
  //    * The largest filing count at a given place and time across the whole dataset
  //    */
  //   const maxFilings = Object.values(featureProperties.bgHeatmap).reduce(
  //     (accum, { c: count }) => Math.max(accum, count),
  //     0
  //   );
    
  //   return interpolateRange(maxFilings, [0, maxFilings]);
  // });

  const choropleth = computed(
    (): Record<ChoroplethMetric, (number | string)[]> => {

      const {
        maxPovertyRate,
        maxRenterCount,
        maxRenterRate
      } = Object.values(featureProperties.bgChoropleth).reduce(
        (accum, item) => ({
          maxRenterRate: Math.max(accum.maxRenterRate, item.rr),
          maxRenterCount: Math.max(accum.maxRenterCount, item.rc),
          maxPovertyRate: Math.max(accum.maxPovertyRate, item.pr),
        }),
        { maxRenterCount: 0, maxRenterRate: 0, maxPovertyRate: 0 }
      );

      return {
        none: [],
        renter_count: interpolateColor(maxRenterCount, BLUE),
        renter_rate: interpolateColor(maxRenterRate, BLUE),
        poverty_rate: interpolateColor(maxPovertyRate, BLUE),
      }
    }
  );

  return { choropleth };
});

export { useInterpolatedColors };
