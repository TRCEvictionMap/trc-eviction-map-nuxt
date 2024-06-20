import type { WritableComputedRef } from "vue";
import { defineStore } from "pinia";
import type { FeatureCollections, SourceId } from "~/utils/types";

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

  const monthEpochMap = ref<Record<string, number>>({});

  const currentTimeInterval = ref<"month" | "year">("year");
  
  /** @deprecated */
  const currentYear = ref(2023);
  /** @deprecated */
  const currentMonth = ref(1);

  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

  const currentMonthRange = ref<[string, string]>(["2022-10", "2023-4"]);

  const availableMonths = computed(() =>
    Object
      .entries(monthEpochMap.value)
      .sort(([, epochA], [, epochB]) => epochA - epochB)
      .map(([month]) => month)
  );

  const currentMonthRangeIndices: WritableComputedRef<[number, number]> = computed({
    get() {
      const [start, end] = currentMonthRange.value;
      return [
        availableMonths.value.indexOf(start),
        availableMonths.value.indexOf(end),
      ];
    },
    set([start, end]) {
      if (availableMonths.value[start]) {
        currentMonthRange.value = [
          availableMonths.value[start],
          availableMonths.value[end]
        ];
      }
    },
  });

  const monthRangeMax = computed(() => availableMonths.value.length - 1);

  const currentSourceHumanReadable = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.text
  );

  const currentSourceDesicription = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.description
  );

  function loadMonthEpochMap(data: FeatureCollections.HeatmapV2) {
    monthEpochMap.value = Object.fromEntries(
      data.features.map((feature) => {
        const featureId = feature.id as string;
        const month = featureId.slice(featureId.indexOf("-") + 1);
        const epoch = feature.properties.e;
        return [month, epoch];
      })
    );
  }

  return {
    loadMonthEpochMap,
    monthEpochMap,
    monthRangeMax,
    currentMonthRangeIndices,
    currentMonthRange,
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
