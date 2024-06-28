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
        maxPovertyRate,
        maxRenterCount,
        maxRenterRate,
        maxPctAsian,
        maxPctAmericanIndian,
        maxPctBlack,
        maxPctMulti,
        maxPctOther,
        maxPctPacificIslander,
        maxPctWhite,
      } = Object.values(featureProperties.bgChoropleth).reduce(
        (accum, item) => ({
          maxPovertyRate: maxPercent(accum.maxPovertyRate, item.pr),
          maxRenterCount: Math.max(accum.maxRenterCount, item.rc),
          maxRenterRate: maxPercent(accum.maxRenterRate, item.rr),
          maxPctAsian: maxPercent(accum.maxPctAsian, item.pct_as),
          maxPctAmericanIndian: maxPercent(accum.maxPctAmericanIndian, item.pct_ai),
          maxPctBlack: maxPercent(accum.maxPctBlack, item.pct_bl),
          maxPctMulti: maxPercent(accum.maxPctMulti, item.pct_multi),
          maxPctOther: maxPercent(accum.maxPctOther, item.pct_other),
          maxPctPacificIslander: maxPercent(accum.maxPctPacificIslander, item.pct_pi),
          maxPctWhite: maxPercent(accum.maxPctWhite, item.pct_wh),
        }),
        {
          maxPovertyRate: 0,
          maxRenterCount: 0,
          maxRenterRate: 0,
          maxPctAsian: 0,
          maxPctAmericanIndian: 0,
          maxPctBlack: 0,
          maxPctMulti: 0,
          maxPctOther: 0,
          maxPctPacificIslander: 0,
          maxPctWhite: 0,
        }
      );

      return {
        none: {
          array: [],
          entries: [],
        },
        renter_count: createInterpolated(maxRenterCount, BLUE),
        renter_rate: createInterpolated(100, BLUE),
        poverty_rate: createInterpolated(100, BLUE),
        pct_american_indian: createInterpolated(100, BLUE),
        pct_asian: createInterpolated(100, BLUE),
        pct_black: createInterpolated(100, BLUE),
        pct_multi: createInterpolated(100, BLUE),
        pct_other: createInterpolated(100, BLUE),
        pct_pacific_islander: createInterpolated(100, BLUE),
        pct_white: createInterpolated(100, BLUE),
      }
    }
  );

  return { choropleth };
});

export { useInterpolatedColors, BLUE };
