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
  const _avalailableDates = ref<{ year: number; month: number }[]>([]);

  const _availableMonths = ref<Set<{ year: number; month: number }>>(new Set());

  const currentTimeInterval = ref<"month" | "year">("year");
  const currentYear = ref(2023);
  const currentMonth = ref(1);
  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

  const currentDateRange = ref<DateRange>({
    startYear: 2022,
    startMonth: 4,
    endYear: 2022,
    endMonth: 10,
  });

  const currentDateRangeIndices: WritableComputedRef<[number, number]> = computed({
    get() {
      const { startMonth, startYear, endMonth, endYear } = currentDateRange.value;
      return [
        _avalailableDates.value.findIndex(
          ({ year, month }) => year === startYear && month === startMonth
        ),
        _avalailableDates.value.findIndex(
          ({ year, month }) => year === endYear && month === endMonth
        ),
      ]
    },
    set(indices) {
      const start = _avalailableDates.value[indices[0]];
      const end = _avalailableDates.value[indices[1]];
      currentDateRange.value = {
        startYear: start.year,
        startMonth: start.month,
        endYear: end.year,
        endMonth: end.month,
      };
    },
  });

  const dateRangeMax = computed(() => _avalailableDates.value.length - 1);

  const yearOptions = computed((): Option<number>[] =>
    Array
      .from(
        new Set(
          Array.from(_availableMonths.value).map(({ year }) => year)
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
            .filter(({ year }) => year === currentYear.value)
            .map(({ month }) => month)
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
    currentDateRangeIndices,
    currentDateRange,
    dateRangeMax,
  };
});

export { useMapControlsV2, isChoroplethMetric };
export type { ChoroplethMetric, DateRange };
