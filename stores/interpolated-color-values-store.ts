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

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const featureProperties = useFeaturePropertiesV2();

  const choropleth = computed(
    (): Record<ChoroplethMetric, Interpolated> => {

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
        none: {
          array: [],
          entries: [],
        },
        renter_count: createInterpolated(maxRenterCount, BLUE),
        renter_rate: createInterpolated(maxRenterRate, BLUE),
        poverty_rate: createInterpolated(maxPovertyRate, BLUE),
      }
    }
  );

  return { choropleth };
});

export { useInterpolatedColors, BLUE };
