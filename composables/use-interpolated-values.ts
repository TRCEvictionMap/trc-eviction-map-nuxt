import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useMapControls } from "~/stores/map-controls-store";

const STEPS = [0.1, 0.3, 0.5, 0.7, 0.9];

function useInterpolatedValues() {
    const featureProperties = useFeatureProperties();
    const controls = useMapControls();

    interface MaxCounts {
        maxFilingCount: number;
        maxFilingRate: number;
        maxRenterCount: number;
    }

    const maxCounts = computed((): MaxCounts =>
        featureProperties.featureIds[controls.currentSource].demographic.reduce(
            (accum: MaxCounts, featureId) => {
                const properties = featureProperties.getFeatureProperties(
                    controls.currentSource,
                    featureId
                );
                if (properties) {
                    const { evictions, renter_count } = properties;
                    const { regionMaxFilingCount, regionMaxFilingRate } = Object.values(evictions).reduce(
                        (
                            accum: { regionMaxFilingCount: number, regionMaxFilingRate: number },
                            { n_filings, filing_rate }
                        ) => {
                            const { regionMaxFilingCount, regionMaxFilingRate } = accum;
                            return {
                                regionMaxFilingCount: Math.max(regionMaxFilingCount, n_filings),
                                regionMaxFilingRate: Math.max(regionMaxFilingRate, filing_rate),
                            };
                        },
                        { regionMaxFilingCount: 0, regionMaxFilingRate: 0 }
                    );
                    accum.maxFilingCount = Math.max(
                        accum.maxFilingCount,
                        regionMaxFilingCount
                    );
                    accum.maxFilingRate = Math.max(
                        accum.maxFilingRate,
                        regionMaxFilingRate
                    );
                    accum.maxRenterCount = Math.max(accum.maxRenterCount, renter_count);
                }
                return accum;
            },
            { maxFilingCount: 0, maxRenterCount: 0, maxFilingRate: 0 }
        )
    );


    const renterCountValues = computed((): Record<string, string> => STEPS.reduce(
        (accum: Record<string, string>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxRenterCount * step)]: `rgba(0, 0, 200, ${step})`
        }),
        {}
    ));

    const filingCountValues = computed(() => STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingCount * step)]: Math.round(16 * step)
        }),
        {}
    ));

    const filingRateValues: Record<string, number> = STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingRate * step)]: 16 * step
        }),
        {}
    );

    const renterRateValues = {
        10: "rgba(0, 0, 255, 0.1)",
        30: "rgba(0, 0, 255, 0.3)",
        50: "rgba(0, 0, 255, 0.5)",
        70: "rgba(0, 0, 255, 0.7)",
        90: "rgba(0, 0, 255, 0.9)",
    }

    return reactive({
        renterCountValues,
        renterRateValues,
        filingCountValues,
        filingRateValues,
    });
}

export { useInterpolatedValues };
