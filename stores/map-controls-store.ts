import { defineStore } from "pinia";
import { SourceId } from "utils/types";

type EvictionMetric = "n_filings" | "filing_rate";
type DemographicMetric = "renter_count" | "renter_rate" | "n_households";

const useMapControls = defineStore("map-controls", () => {
    const sourceOptions: SourceId[] = [
        "alder-district",
        "block-group",
    ];

    const evictionMetricOptions: EvictionMetric[] = [
        "filing_rate",
        "n_filings",
    ];

    const demographicMetricOptions: DemographicMetric[] = [
        "n_households",
        "renter_count",
        "renter_rate",
    ]

    const currentYear = ref<string>("2023");
    const currentSource = ref<SourceId>("block-group");
    const currentEvictionMetric = ref<EvictionMetric>("n_filings");
    const currentDemographicMetric = ref<DemographicMetric>("renter_rate");

    return {
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
