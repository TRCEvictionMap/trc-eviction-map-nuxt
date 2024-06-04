import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useMapControls } from "~/stores/map-controls-store";

const STEPS = [0, 0.1, 0.5, 0.9];

const FILL_RGB = [120, 151, 181];

const RADIUS = 16;

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

    function interpolate(maxValue: number, colorFn: "fill" | "radius"): Record<string, number> {
        return  STEPS.reduce(
            (accum: Record<string, number>, step) => ({
                ...accum,
                [Math.round(maxValue * step)]: colorFn === "fill"
                    ? interpolateFillRGBA(step)
                    : interpolateCircleRadius(step)
            }),
            {}
        );
    }

    const filingCountValues = computed(() => interpolate(maxCounts.value.maxFilingCount, "radius"));
    const filingRateValues = computed(() => interpolate(maxCounts.value.maxFilingRate, "radius"));
    const renterCountValues = computed(() => interpolate(maxCounts.value.maxRenterCount, "fill"));
    const povertyRateValues = computed(() => interpolate(maxCounts.value.maxPovertyRate, "fill"));
    const renterRateValues = computed(() => interpolate(100, "fill"));

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
