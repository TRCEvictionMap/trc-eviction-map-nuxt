import { defineStore } from "pinia";
import { useMapControls } from "./map-controls-store";
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

const YELLOW_TO_RED = [
  "#ffffcc",
  "#ffeda0",
  "#fed976",
  "#feb24c",
  "#fd8d3c",
  "#fc4e2a",
  "#e31a1c",
  "#bd0026",
  "#800026",
]

function interpolateColor(maxValue: number, gradient: string[]) {
  return gradient.flatMap((color, step) => [Math.round(maxValue * (step / gradient.length)), color])
}

function interpolateRange(maxValue: number, range: number[]): [number, number][] {
  return range.map((value, step) => [Math.round(maxValue * (step / range.length)), value]);
}

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const controls = useMapControlsV2();
  const featureProperties = useFeaturePropertiesV2();

  const heatmap = computed((): [number, number][] => {

    /**
     * The most filings for any address in a given year (and month).
     */
    const maxFilings = Object.values(featureProperties.bgHeatmap).reduce(
      (accum, item) => {
        if (controls.currentTimeInterval === "month") {
          if (item.y === controls.currentYear && item.m === controls.currentMonth) {
            accum += item.count;
          }
        } else if (item.y === controls.currentYear) {
          accum += item.count;
        }
        return accum;
      },
      0
    );
    
    return interpolateRange(maxFilings, [0, 0.2, 0.4, 0.6, 0.8]);
    return interpolateRange(maxFilings, [0, 0.4, 0.8]);
  });

  const choropleth = computed(
    (): Record<ChoroplethMetric, (number | string)[]> => {

      const {
        maxPovertyRate,
        maxRenterCount,
        maxRenterRate
      } = Object.values(featureProperties.bgDemographics).reduce(
        (accum, item) => ({
          maxRenterRate: Math.max(accum.maxRenterRate, item.rr),
          maxRenterCount: Math.max(accum.maxRenterCount, item.rc),
          maxPovertyRate: Math.max(accum.maxPovertyRate, item.pr),
        }),
        { maxRenterCount: 0, maxRenterRate: 0, maxPovertyRate: 0 }
      );


      return {
        none: [],
        n_filings: [],
        renter_count: interpolateColor(maxRenterCount, BLUE),
        renter_rate: interpolateColor(maxRenterRate, BLUE),
        poverty_rate: interpolateColor(maxPovertyRate, BLUE),
      }
    }
  );

  return { choropleth, heatmap };
});

export { useInterpolatedColors };
