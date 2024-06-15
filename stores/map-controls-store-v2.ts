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

interface DateRange {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

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

  const _availableDatesV2 = ref<{ date: string, epoch: number }[]>([]);

  const _avalailableDates = ref<{ year: number; month: number }[]>([]);

  const _availableMonths = ref<Set<{ year: number; month: number }>>(new Set());

  const currentTimeInterval = ref<"month" | "year">("year");
  const currentYear = ref(2023);
  const currentMonth = ref(1);
  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

  const currentDateRangeV2 = ref<[string, string]>(["2022-4", "2023-4"]);

  const currentDateRangeIndicesV2: WritableComputedRef<[number, number]> = computed({
    get() {
      const [start, end] = currentDateRangeV2.value;
      return [
        _availableDatesV2.value.findIndex(({ date }) => date === start),
        _availableDatesV2.value.findIndex(({ date }) => date === end),
      ];
    },
    set([start, end]) {
      if (_availableDatesV2.value[start]) {
        currentDateRangeV2.value = [
          _availableDatesV2.value[start].date,
          _availableDatesV2.value[end].date
        ]
      }
    },
  });

  /**
   * A range of unix epoch timestamps
   * 
   * `[start, end]`
   */
  const currentEpochRangeV2 = computed((): [number, number] => {
    const [start, end] = currentDateRangeIndicesV2.value;
    if (_availableDatesV2.value[start]) {
      return [
        _availableDatesV2.value[start].epoch,
        _availableDatesV2.value[end].epoch,
      ];
    }
    return [-1, -1]
  });


  const dateRangeMax = computed(() => _avalailableDates.value.length - 1);

  const currentSourceHumanReadable = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.text
  );

  const currentSourceDesicription = computed(() =>
    sourceOptions.find((opt) => opt.value === currentSource.value)?.description
  );

  function loadDateEpochMap(data: FeatureCollections.HeatmapV2) {
    const dateEpochMap = Object.fromEntries(
      data.features.map((feature) => {
        const featureId = feature.id as string;
        const date = featureId.slice(featureId.indexOf("-") + 1);
        const epoch = feature.properties.e;
        return [date, epoch];
      })
    );

    _availableDatesV2.value = Object
      .entries(dateEpochMap)
      .map(([date, epoch]) => ({ date, epoch }))
      .sort((a, b) => a.epoch - b.epoch);
  }

  function loadAvailableMonths(data: FeatureCollections.ChoroplethV2) {
    _avalailableDates.value = Object
      .keys(data.features[0].properties.filings)
      .map((key) => {
        const [year, month] = key.split("-");
        return {
          year: Number.parseInt(year),
          month: Number.parseInt(month),
        };
      })
      .sort((a, b) => a.year === b.year
        ? a.month - b.month
        : a.year - b.year
      );

    Object.keys(data.features[0].properties.filings).forEach((key) => {
      const [year, month] = key.split("-");
      _availableMonths.value.add({
        year: Number.parseInt(year),
        month: Number.parseInt(month), 
      });
    });
  }

  return {
    loadAvailableMonths,
    loadDateEpochMap,
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
    currentDateRangeIndicesV2,
    currentDateRangeV2,
    currentEpochRangeV2,
    dateRangeMax,
  };
});

export { useMapControlsV2, isChoroplethMetric };
export type { ChoroplethMetric, DateRange };
