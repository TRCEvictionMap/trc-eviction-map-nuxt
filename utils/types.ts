
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


type Region = "Block Group";

interface DemographicFeatureProperties {
    id: string;
    region: Region;
    n_households: number;
    owner_count: number;
    renter_count: number;
    renter_rate: number;
}

type Year = "2021" | "2022" | "2023" | string;
interface EvictionFeatureProperties {
    id: string;
    region: Region;
    evictions: Record<Year, {
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

export { isSourceId };
export type {
    EvictionFeatureCollection,
    EvictionFeatureProperties,
    DemographicFeatureProperties,
    SourceId,
    FeatureId,
    MapboxMouseEvent
};
