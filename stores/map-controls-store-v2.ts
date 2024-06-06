

import { defineStore } from "pinia";
import type { SourceId } from "~/utils/types";

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


function isChoroplethMetric(data: unknown): data is ChoroplethMetric {
  return CHOROPLETH_METRICS.includes(data as ChoroplethMetric);
}


const useMapControlsV2 = defineStore("map-controls-v2", () => {
  const yearOptions = ref<Option<string>[]>([]);

  const currentTimeInterval = ref<"month" | "year">("year");
  const currentYear = ref(2023);
  const currentMonth = ref(1);
  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

  const currentSourceHumanReadable = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.text
  );

  const currentSourceDesicription = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.description
  );

  return {
    yearOptions,
    sourceOptions,
    choroplethMetricOptions,
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
