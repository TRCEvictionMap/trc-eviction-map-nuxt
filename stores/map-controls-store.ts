import { defineStore } from "pinia";
import type { SourceId } from "~/utils/types";

const EVICTION_METRICS = [
    "n_filings",
    "filing_rate",
    "none"
] as const;
const DEMOGRAPHIC_METRICS = [
    "renter_count",
    "renter_rate",
    "poverty_rate",
    "none"
] as const;

type EvictionMetric = typeof EVICTION_METRICS[number];
type DemographicMetric = typeof DEMOGRAPHIC_METRICS[number];

function isEvictionMetric(data: unknown): data is EvictionMetric {
    return EVICTION_METRICS.includes(data as EvictionMetric);
}

function isDemographicMetric(data: unknown): data is DemographicMetric {
    return DEMOGRAPHIC_METRICS.includes(data as DemographicMetric);
}

type Option<Value> = { text?: string; value: Value; description?: string };

const useMapControls = defineStore("map-controls", () => {
    const yearOptions = ref<Option<string>[]>([]); 

    const sourceOptions = ref<Option<SourceId>[]>([
        {
            text: "Block Group",
            value: "block-group",
            description: "A statistical geographic unit used by the U.S. Census to organize data it publishes"
        },
    ]);

    const evictionMetricOptions = ref<Option<EvictionMetric>[]>([
        {
            text: "None",
            value: "none",
        },
        {
            text: "Eviction Filings",
            value: "n_filings",
        },
        {
            text: "Eviction Filing Rate",
            value: "filing_rate",
        },
    ]);

    const demographicMetricOptions = ref<Option<DemographicMetric>[]>([
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
    ]);

    const currentYear = ref<string>("2023");
    const currentSource = ref<SourceId>("block-group");
    const currentEvictionMetric = ref<EvictionMetric>("n_filings");
    const currentDemographicMetric = ref<DemographicMetric>("renter_rate");

    const currentSourceHumanReadable = computed(() =>
        sourceOptions.value.find((opt) => opt.value === currentSource.value)?.text
    );

    const currentSourceDesicription = computed(() =>
        sourceOptions.value.find((opt) => opt.value === currentSource.value)?.description 
    );

    return {
        yearOptions,
        sourceOptions,
        evictionMetricOptions,
        demographicMetricOptions,
        currentSource,
        currentSourceHumanReadable,
        currentSourceDesicription,
        currentYear,
        currentEvictionMetric,
        currentDemographicMetric,
    };
});

export { useMapControls, isEvictionMetric, isDemographicMetric };
export type { EvictionMetric, DemographicMetric };
