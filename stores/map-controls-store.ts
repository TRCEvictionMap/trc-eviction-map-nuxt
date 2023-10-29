import { defineStore } from "pinia";
import { SourceId } from "utils/types";

const EVICTION_METRICS = ["n_filings", "filing_rate", "none"] as const;
const DEMOGRAPHIC_METRICS = ["renter_count", "renter_rate", "none"] as const;

type EvictionMetric = typeof EVICTION_METRICS[number];
type DemographicMetric = typeof DEMOGRAPHIC_METRICS[number];

function isEvictionMetric(data: unknown): data is EvictionMetric {
    return EVICTION_METRICS.includes(data as EvictionMetric);
}

function isDemographicMetric(data: unknown): data is DemographicMetric {
    return DEMOGRAPHIC_METRICS.includes(data as DemographicMetric);
}

type Option<Value> = { text?: string; value: Value; };

const useMapControls = defineStore("map-controls", () => {
    const yearOptions = ref<Option<string>[]>([]); 

    const sourceOptions = ref<Option<SourceId>[]>([
        {
            text: "Census Block Group",
            value: "block-group",
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
            text: "Renter Occupied Households",
            value: "renter_count",
        },
        {
            text: "Percent Renter Occupied",
            value: "renter_rate",
        },
    ]);

    const currentYear = ref<string>("2023");
    const currentSource = ref<SourceId>("block-group");
    const currentEvictionMetric = ref<EvictionMetric>("n_filings");
    const currentDemographicMetric = ref<DemographicMetric>("renter_rate");

    return {
        yearOptions,
        sourceOptions,
        evictionMetricOptions,
        demographicMetricOptions,
        currentSource,
        currentYear,
        currentEvictionMetric,
        currentDemographicMetric,
    };
});

export { useMapControls, isEvictionMetric, isDemographicMetric };
export type { EvictionMetric, DemographicMetric };
