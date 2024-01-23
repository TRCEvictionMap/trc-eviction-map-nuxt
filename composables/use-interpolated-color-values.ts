import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useMapControls } from "~/stores/map-controls-store";

const STEPS = [0, 0.1, 0.5, 0.9];

const FILL_RGB = [120, 151, 181];

const RADIUS = 20;

const CIRCLE_COLOR = "#F48545";

function interpolateFillRGBA(alpha: number) {
    const [r, g, b] = FILL_RGB;
    return `rgba(${r},${g},${b},${alpha})`;
}

function interpolateCircleRadius(step: number) {
    return Math.round(RADIUS * step);
}

function useInterpolatedColorValues() {
    const featureProperties = useFeatureProperties();
    const controls = useMapControls();

    interface MaxCounts {
        maxFilingCount: number;
        maxFilingRate: number;
        maxRenterCount: number;
        maxPovertyRate: number;
    }

    const maxCounts = computed((): MaxCounts =>
        featureProperties.featureIds[controls.currentSource].demographic.reduce(
            (accum: MaxCounts, featureId) => {
                const properties = featureProperties.getFeatureProperties(
                    controls.currentSource,
                    featureId
                );
                if (properties) {
                    const { evictions, renter_count, poverty_rate } = properties;
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
                    accum.maxPovertyRate = Math.max(accum.maxPovertyRate, poverty_rate);
                    accum.maxRenterCount = Math.max(accum.maxRenterCount, renter_count);
                }
                return accum;
            },
            { maxFilingCount: 0, maxRenterCount: 0, maxFilingRate: 0, maxPovertyRate: 0 }
        )
    );


    const renterCountValues = computed((): Record<string, string> => STEPS.reduce(
        (accum: Record<string, string>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxRenterCount * step)]: interpolateFillRGBA(step)
        }),
        {}
    ));

    const filingCountValues = computed((): Record<string, number> => STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingCount * step)]: interpolateCircleRadius(step)
        }),
        {}
    ));

    const filingRateValues = computed((): Record<string, number> => STEPS.reduce(
        (accum: Record<string, number>, step) => ({
            ...accum,
            [Math.round(maxCounts.value.maxFilingRate * step)]: interpolateCircleRadius(step)
        }),
        {}
    ));

    const renterRateValues = {
        0: interpolateFillRGBA(0),
        10: interpolateFillRGBA(0.1),
        50: interpolateFillRGBA(0.5),
        90: interpolateFillRGBA(0.9),
    };
    
    const povertyRateValues = {
        0: interpolateFillRGBA(0),
        10: interpolateFillRGBA(0.1),
        50: interpolateFillRGBA(0.5),
        90: interpolateFillRGBA(0.9),
    };

    return reactive({
        none: [],
        renter_count: renterCountValues,
        renter_rate: renterRateValues,
        poverty_rate: povertyRateValues,
        n_filings: filingCountValues,
        filing_rate: filingRateValues,
    });
}

export { useInterpolatedColorValues, interpolateCircleRadius, interpolateFillRGBA, CIRCLE_COLOR };
