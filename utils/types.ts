
type SourceId = "alder-districts" | "zip-codes" | "block-group";

const SOURCE_OPTIONS: SourceId[] = [
    "alder-districts",
    "block-group",
    "zip-codes",
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

type FeatureId = GeoJSON.Feature["id"];

type MapboxMouseEvent<WithFeatures extends boolean = false> = WithFeatures extends true
    ? mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
    : mapboxgl.MapMouseEvent & mapboxgl.EventData;

export { isSourceId };
export type { AlderDistricts, SourceId, FeatureId, MapboxMouseEvent };
