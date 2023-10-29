import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useMapControls } from "~/stores/map-controls-store";

const STEPS = [0.1, 0.5, 0.9];
const RGB = [0, 115, 200];
const RADIUS = 16;

function useInterpolatedValues() {
    const featureProperties = useFeatureProperties();
    const controls = useMapControls();

    function rgba(alpha: number) {
        return `rgba(${RGB[0]},${RGB[1]},${RGB[2]},${alpha})`;
    }

    function radius(step: number) {
        return Math.round(RADIUS * step);
    }

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
            [Math.round(maxCounts.value.maxRenterCount * step)]: rgba(step)
        }),
        {}
    ));

    const filingCountValues = computed((): Record<string, number> => STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingCount * step)]: radius(step)
        }),
        {}
    ));

    const filingRateValues = computed((): Record<string, number> => STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingRate * step)]: radius(step)
        }),
        {}
    ));

    const renterRateValues = {
        10: rgba(0.1),
        50: rgba(0.5),
        90: rgba(0.9),
    };

    return reactive({
        radius,
        rgba,
        none: [],
        renter_count: renterCountValues,
        renter_rate: renterRateValues,
        n_filings: filingCountValues,
        filing_rate: filingRateValues,
    });
}

export { useInterpolatedValues };
