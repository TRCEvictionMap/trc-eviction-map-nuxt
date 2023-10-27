import { defineStore } from "pinia";
import { SourceId } from "utils/types";

type EvictionMetric = "n_filings" | "filing_rate";
type DemographicMetric = "renter_count" | "renter_rate";

type Option<Value> = { text?: string; value: Value; };

const useMapControls = defineStore("map-controls", () => {
    const yearOptions = ref<Option<string>[]>([]); 

    const sourceOptions = ref<Option<SourceId>[]>([
        // {
        //     text: "Aldermanic district",
        //     value: "alder-district",
        // },
        {
            text: "Census block groups",
            value: "block-group",
        },
    ]);

    const evictionMetricOptions = ref<Option<EvictionMetric>[]>([
        {
            text: "Eviction filings",
            value: "n_filings",
        },
        {
            text: "Eviction filing rate",
            value: "filing_rate",
        },
    ]);

    const demographicMetricOptions = ref<Option<DemographicMetric>[]>([
        {
            text: "Renter-occupied households",
            value: "renter_count",
        },
        {
            text: "Percent renter-occupied",
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

export { useMapControls };
export type { EvictionMetric, DemographicMetric };
