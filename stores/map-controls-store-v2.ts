

import { defineStore } from "pinia";
import type { SourceId } from "~/utils/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CHOROPLETH_METRICS = [
  "n_filings",
  "renter_count",
  "renter_rate",
  "poverty_rate",
  "none"
] as const;

type ChoroplethMetric = typeof CHOROPLETH_METRICS[number];

interface Option<Value> {
  text?: string;
  value: Value;
  description?: string
};

const sourceOptions: Option<SourceId>[] = [
  {
    text: "Block Group",
    value: "block-group",
    description: "A statistical geographic unit used by the U.S. Census to organize data it publishes"
  },
];

const choroplethMetricOptions: Option<ChoroplethMetric>[] = [
  {
    text: "None",
    value: "none",
  },
  {
    text: "Renter-Occupied Households",
    value: "renter_count",
  },
  {
    text: "Percent Renter-Occupied",
    value: "renter_rate",
  },
  {
    text: "Poverty Rate",
    value: "poverty_rate",
  },
  {
    text: "Eviction Filings",
    value: "n_filings",
  }
];

const timeIntervalOptions: Option<"month" | "year">[] = [
  {
    text: "Year",
    value: "year",
  },
  {
    text: "Month",
    value: "month",
  },
];


function isChoroplethMetric(data: unknown): data is ChoroplethMetric {
  return CHOROPLETH_METRICS.includes(data as ChoroplethMetric);
}


const useMapControlsV2 = defineStore("map-controls-v2", () => {
  const _availableMonths = ref<Set<{ y: number; m: number }>>(new Set());

  const currentTimeInterval = ref<"month" | "year">("year");
  const currentYear = ref(2023);
  const currentMonth = ref(1);
  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

  const yearOptions = computed((): Option<number>[] =>
    Array
      .from(
        new Set(
          Array.from(_availableMonths.value).map(({ y }) => y)
        )
      )
      .map((year) => ({ value: year }))
      .sort((a, b) => b.value - a.value)
  );

  const monthOptions = computed((): Option<number>[] =>
    Array
      .from(
        new Set(
          Array
            .from(_availableMonths.value.keys())
            .filter(({ y }) => y === currentYear.value)
            .map(({ m }) => m)
        )
      )
      .map((month) => ({ value: month, text: MONTHS[month - 1] }))
      .sort((a, b) => a.value - b.value)
  );

  const currentSourceHumanReadable = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.text
  );

  const currentSourceDesicription = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.description
  );

  function loadAvailableMonths(featureCollection: HeatmapFeatureCollection) {
    featureCollection
      .features
      .forEach(({ properties: { y, m } }) => {
        _availableMonths.value.add({ y, m });
      });
  }

  return {
    loadAvailableMonths,
    yearOptions,
    monthOptions,
    sourceOptions,
    choroplethMetricOptions,
    timeIntervalOptions,
    currentSource,
    currentSourceHumanReadable,
    currentSourceDesicription,
    currentTimeInterval,
    currentYear,
    currentMonth,
    currentChoroplethMetric,
  };
});

export { useMapControlsV2, isChoroplethMetric };
export type { ChoroplethMetric };
