
type SourceId = "alder-district" | "block-group";

const SOURCE_OPTIONS: SourceId[] = [
    "alder-district",
    "block-group",
];

function isSourceId(data: unknown): data is SourceId {
    if (typeof data === "string") {
        return SOURCE_OPTIONS.includes(data as SourceId);
    }
    return false;
}

type Region = "Block Group";

interface DemographicFeatureProperties {
    id: string;
    region: Region;
    renter_count: number;
    renter_count_moe: number;
    renter_rate: number;
    renter_rate_moe: number;
    poverty_rate: number;
    poverty_rate_moe: number;
    race: {
        pct_wh: number;
        pct_bl: number;
        pct_ai: number;
        pct_as: number;
        pct_pi: number;
        pct_other: number;
        pct_multi: number;
    };
}

interface EvictionFeatureProperties {
    id: string;
    region: Region;
    evictions: Record<string, {
        n_filings: number;
        filing_rate: number;
    }>;
}

type EvictionFeatureCollection = GeoJSON.FeatureCollection<
    any,
    EvictionFeatureProperties | DemographicFeatureProperties
>;

type FeatureId = GeoJSON.Feature["id"];

type MapboxMouseEvent<WithFeatures extends boolean = false> = WithFeatures extends true
    ? mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
    : mapboxgl.MapMouseEvent & mapboxgl.EventData;


type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export { isSourceId };
export type {
    EvictionFeatureCollection,
    EvictionFeatureProperties,
    DemographicFeatureProperties,
    SourceId,
    FeatureId,
    MapboxMouseEvent,
    Position
};
