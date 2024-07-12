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
  "pct_american_indian",
  "pct_asian",
  "pct_black",
  "pct_multi",
  "pct_other",
  "pct_pacific_islander",
  "pct_white",
  "pct_hl",
  "pop",
  "none"
] as const;

type ChoroplethMetric = typeof CHOROPLETH_METRICS[number];

const VALID_RANGE_SIZES = [0, 6, 12] as const;

type ValidRangeSize = typeof VALID_RANGE_SIZES[number];

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
    text: "Renter Count",
    value: "renter_count",
  },
  {
    text: "Renter Rate",
    value: "renter_rate",
  },
  {
    text: "Population",
    value: "pop",
  },
  {
    text: "Poverty Rate",
    value: "poverty_rate",
  },
  {
    text: "% American Indian",
    value: "pct_american_indian",
  },
  {
    text: "% Asian",
    value: "pct_asian",
  },
  {
    text: "% Black",
    value: "pct_black",
  },
  {
    text: "% Hispanic or Latino",
    value: "pct_hl",
  },
  {
    text: "% Multiple Races",
    value: "pct_multi",
  },
  {
    text: "% Other",
    value: "pct_other",
  },
  {
    text: "% Pacific Islander",
    value: "pct_pacific_islander",
  },
  {
    text: "% White",
    value: "pct_white",
  },
];

const timeIntervalOptions: Option<ValidRangeSize>[] = [
  {
    text: "12 months",
    value: 12,
  },
  {
    text: "6 months",
    value: 6,
  },
  {
    text: "1 month",
    value: 0,
  }
];

function isChoroplethMetric(data: unknown): data is ChoroplethMetric {
  return CHOROPLETH_METRICS.includes(data as ChoroplethMetric);
}

const useMapControlsV2 = defineStore("map-controls-v2", () => {

  const showHeatmap = ref(false);

  const monthEpochMap = ref<Record<string, number>>({});

  /** @deprecated */
  const currentYear = ref(2023);
  /** @deprecated */
  const currentMonth = ref(1);

  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_count");

  const availableMonthRangeValues = computed(() =>
    Object
      .entries(monthEpochMap.value)
      .sort(([, epochA], [, epochB]) => epochA - epochB)
      .map(([month]) => month)
  );

  const monthRangeMax = computed(() => availableMonthRangeValues.value.length - 1);

  const _currentMonthRange = ref<[string, string]>(["", ""]);

  const currentMonthRangeIndices: RangeSlider.Range = computed({
    get() {
      const [start, end] = _currentMonthRange.value;
      return [
        availableMonthRangeValues.value.indexOf(start),
        availableMonthRangeValues.value.indexOf(end),
      ];
    },
    set([start, end]) {
      if (availableMonthRangeValues.value[start]) {
        _currentMonthRange.value = [
          availableMonthRangeValues.value[start],
          availableMonthRangeValues.value[end]
        ];
      }
    },
  });

  const currentMonthRangeSize = computed({
    get() {
      return currentMonthRangeIndices.value[1] - currentMonthRangeIndices.value[0];
    },
    set(newSize) {
      currentMonthRangeIndices.value = resizeSpan(
        currentMonthRangeIndices.value,
        {
          min: 0,
          max: monthRangeMax.value,
        },
        newSize
      );
    },
  });

  const currentMonthRange = computed({
    get() {
      return _currentMonthRange.value;
    },
    set([start, end]) {
      const [startIndex, endIndex] = findBestFitSpan(
        [
          availableMonthRangeValues.value.indexOf(start),
          availableMonthRangeValues.value.indexOf(end),
        ],
        {
          min: 0,
          max: monthRangeMax.value,
        },
        VALID_RANGE_SIZES as unknown as number[]
      );
      _currentMonthRange.value = [
        availableMonthRangeValues.value[startIndex],
        availableMonthRangeValues.value[endIndex],
      ]
    },
  });

  const currentMonthRangeHumanReadable = computed(() => {
    const start = formatDateString(currentMonthRange.value[0]);
    const end = formatDateString(currentMonthRange.value[1]);

    if (!start || !end) {
      return;
    }

    return {
      start,
      end,
      isSingle: start.y === end.y && start.m === end.m,
    };
  });

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
    availableMonthRangeValues,
    currentMonthRangeIndices,
    currentMonthRange,
    sourceOptions,
    choroplethMetricOptions,
    timeIntervalOptions,
    currentSource,
    currentSourceHumanReadable,
    currentSourceDesicription,
    currentMonthRangeSize,
    currentYear,
    currentMonth,
    currentChoroplethMetric,
    currentMonthRangeHumanReadable,
    showHeatmap,
  };
});

export { useMapControlsV2, isChoroplethMetric };
export type { ChoroplethMetric };
