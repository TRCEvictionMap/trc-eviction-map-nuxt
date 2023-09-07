
type AlderDistricts = GeoJSON.FeatureCollection<any, {
    count: number;
    month: string;
    district_no: number;
}>;

type FeatureId = GeoJSON.Feature["id"];

type MapboxMouseEvent<WithFeatures extends boolean = false> = WithFeatures extends true
    ? mapboxgl.MapMouseEvent & {
        features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
    : mapboxgl.MapMouseEvent & mapboxgl.EventData;



export type { AlderDistricts, FeatureId, MapboxMouseEvent };
