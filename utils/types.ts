
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

type AlderDistricts = GeoJSON.FeatureCollection<any, {
    count: number;
    month: string;
    district_no: number;
}[]>;

interface EvictionFeatureProperties {
    id: string;
    geog_name: string;
    owner_count: number;
    renter_count: number;
    filing_year: number;
    n_filings: number;
    filing_rate: number;
}

type EvictionFeatureCollection = GeoJSON.FeatureCollection<any, EvictionFeatureProperties>;

type FeatureId = GeoJSON.Feature["id"];

type MapboxMouseEvent<WithFeatures extends boolean = false> = WithFeatures extends true
    ? mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
    : mapboxgl.MapMouseEvent & mapboxgl.EventData;

export { isSourceId };
export type { EvictionFeatureCollection, EvictionFeatureProperties, SourceId, FeatureId, MapboxMouseEvent };
