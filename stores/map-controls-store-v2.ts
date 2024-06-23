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

  const monthEpochMap = ref<Record<string, number>>({});

  /** @deprecated */
  const currentYear = ref(2023);
  /** @deprecated */
  const currentMonth = ref(1);

  const currentSource = ref<SourceId>("block-group");

  const currentChoroplethMetric = ref<ChoroplethMetric>("renter_rate");

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
    const [start, end] = currentMonthRange.value;

    if (!start.trim()) {
      return {
        simple: "",
        verbose: "",
      };
    }

    let [y1, m1] = start.split("-");
    let [y2, m2] = end.split("-");
    
    m1 = MONTHS[Number.parseInt(m1) - 1];
    m2 = MONTHS[Number.parseInt(m2) - 1];

    if (y1 === y2 && m1 === m2) {
      return {
        simple: `${m1} ${y1}`,
        verbose: `View evictions filed from the beginning through the end of ${m1} ${y1}.`,
      };
    }

    return {
      simple: `${m1} ${y1} - ${m2} ${y2}`,
      verbose: `View evictions filed from the beginning of ${m1} ${y1} through the end of ${m2} ${y2}.`
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
  };
});

export { useMapControlsV2, isChoroplethMetric };
export type { ChoroplethMetric };
