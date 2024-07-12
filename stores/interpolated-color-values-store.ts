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
  return gradient.map((color, step) => [Math.round(maxValue * (step / gradient.length)), color])
}

interface Interpolated {
  array: (number | string)[];
  entries: (number | string)[][];
}

function createInterpolated(maxValue: number, gradient: string[]): Interpolated {
  const interpolated = interpolateColor(maxValue, gradient);
  return {
    array: interpolated.flat(),
    entries: interpolated,
  };
}

function maxPercent(currentMax: number, test: number): number {
  return Math.min(100, Math.max(currentMax, test));
}

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const featureProperties = useFeaturePropertiesV2();

  const choropleth = computed(
    (): Record<ChoroplethMetric, Interpolated> => {

      const {
        maxRenterCount,
        maxPopulation,
      } = Object.values(featureProperties.bgChoropleth).reduce(
        (accum, item) => ({
          maxRenterCount: Math.max(accum.maxRenterCount, item.rc),
          maxPopulation: Math.max(accum.maxPopulation, item.pop),
        }),
        {
          maxRenterCount: 0,
          maxPopulation: 0,
        }
      );

      const percentInterpolation = createInterpolated(100, BLUE);

      return {
        none: {
          array: [],
          entries: [],
        },
        renter_count: createInterpolated(maxRenterCount, BLUE),
        pop: createInterpolated(maxPopulation, BLUE),
        renter_rate: percentInterpolation,
        poverty_rate: percentInterpolation,
        pct_american_indian: percentInterpolation,
        pct_asian: percentInterpolation,
        pct_black: percentInterpolation,
        pct_multi: percentInterpolation,
        pct_other: percentInterpolation,
        pct_pacific_islander: percentInterpolation,
        pct_white: percentInterpolation,
        pct_hl: percentInterpolation,
      }
    }
  );

  return { choropleth };
});

export { useInterpolatedColors, BLUE };
