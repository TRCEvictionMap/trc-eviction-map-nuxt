import { useMapControls } from "~/stores/map-controls-store";
import type {  DemographicFeatureProperties, EvictionFeatureProperties } from "~/utils/types";

type Tooltipped = keyof Pick<
  DemographicFeatureProperties,
  "poverty_rate" |
  "renter_count" |
  "renter_rate"
> | keyof Pick<
  EvictionFeatureProperties["evictions"][string],
  "filing_rate" |
  "n_filings"
>;

function useTooltipText() {
  const controls = useMapControls();
  
  return computed((): Record<Tooltipped, string> => {
    const geography = controls.currentSourceHumanReadable?.toLowerCase();

    return {
      renter_count: `The number of renter-occupied households in a ${geography}.`,
      renter_rate: `The percentage of renter-occupied households in a ${geography}.`,
      poverty_rate: `The percentage of families in a ${geography} whose income in the past 12 months was below the federal poverty level.`,
      n_filings: `The total number of evictions filed where the tenant lived in a given ${geography}.`,
      filing_rate: `A ratio representing the number of evictions filed for every 100 renter-occupied households in a given ${geography}.`,
    };
  });
}

export { useTooltipText };
