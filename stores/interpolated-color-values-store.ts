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
  "#08306b"
];

function interpolate(maxValue: number, gradient: string[]) {
  return gradient.flatMap((_, step) => [Math.round(maxValue * (step / 10)), gradient[step]])
}

function findMax(values: number[]) {
  return values.reduce((accum, num) => Math.max(accum, num), 0);
}

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const controls = useMapControlsV2();
  const featureProperties = useFeaturePropertiesV2();

  const choropleth = computed(
    (): Record<ChoroplethMetric, (number | string)[]> => {

      interface MaxValue {
        renter_count: number;
        renter_rate: number;
        poverty_rate: number;
      }

      const maxValue = Object.values(featureProperties.bgDemographics).reduce(
        (accum: MaxValue, item) => ({
          renter_rate: Math.max(accum.renter_rate, item.rr),
          renter_count: Math.max(accum.renter_count, item.rc),
          poverty_rate: Math.max(accum.poverty_rate, item.pr),
        }),
        { renter_count: 0, renter_rate: 0, poverty_rate: 0 }
      );

      return {
        none: [],
        n_filings: [],
        renter_count: interpolate(maxValue.renter_count, BLUE),
        renter_rate: interpolate(maxValue.renter_rate, BLUE),
        poverty_rate: interpolate(maxValue.poverty_rate, BLUE),
      }
    }
  );

  return { choropleth };
});

export { useInterpolatedColors };
