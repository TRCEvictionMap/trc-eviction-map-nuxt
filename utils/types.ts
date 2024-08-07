
type SourceId =  "block-group";

const SOURCE_OPTIONS: SourceId[] = [
    // "alder-district",
    "block-group",
];

function isSourceId(data: unknown): data is SourceId {
    if (typeof data === "string") {
        return SOURCE_OPTIONS.includes(data as SourceId);
    }
    return false;
}

type Region = "Block Group";

interface DemographicFeaturePropertiesV2 {
    id: string;
    region: Region;
    /** renter count */
    rc: number;
    /** renter count margin of error */
    rcm: number;
    /** renter rate */
    rr: number;
    /** renter rate margin of error */
    rrm: number;
    /** poverty rate */
    pr: number;
    /** poverty rate margin of error */
    prm: number;
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

interface ChoroplethFeatureProperties {

}

interface HeatmapFeatureProperties {
    region_id: string;
    count: number;
    /** year */
    y: number;
    /** month */
    m: number;
}

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

type DemographicsFeatureCollectionV2 = GeoJSON.FeatureCollection<any, DemographicFeaturePropertiesV2>;
type HeatmapFeatureCollection = GeoJSON.FeatureCollection<any, HeatmapFeatureProperties>;

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

namespace FeatureProperties {

    export interface ChoroplethV2 {
        id: string;
        /** census tract */
        tr: string;
        /** census block group */
        bg: string;
        /** renter count */
        rc: number;
        /** renter count margin of error */
        rcm: number;
        /** renter rate */
        rr: number;
        /** renter rate margin of error */
        rrm: number;
        /** poverty rate */
        pr: number;
        /** poverty rate margin of error */
        prm: number;
        /** Total population */
        pop: number;
        /** Percent Hispanic or Latino */
        pct_hl: number;
        /** Percent White alone */
        pct_wh: number;    
        /** Percent Black or African American alone */
        pct_bl: number;
        /** Percent American Indian and Alaska Native alone */
        pct_ai: number;
        /** Percent Asian alone */
        pct_as: number;
        /** Percent Native Hawaiian and Other Pacific Islander alone */
        pct_pi: number;
        /** Percent Some Other Race alone */
        pct_other: number;
        /** Percent population of two or more races*/
        pct_multi: number;
        filings: Record<string, {
            /** filing count */
            c: number;
            /** filing rate */
            r: number;
        }>,
    }

    export interface HeatmapV2 {
        /** count */
        c: number;
        /** unix epoch */
        e: number;
    }
}

namespace FeatureCollections {
    export type ChoroplethV2 = GeoJSON.FeatureCollection<
        GeoJSON.Polygon,
        FeatureProperties.ChoroplethV2
    >;
    
    export type HeatmapV2 = GeoJSON.FeatureCollection<
        GeoJSON.Polygon,
        FeatureProperties.HeatmapV2
    >;
}

namespace Range {
    export type Span = [start: number, end: number];

    export interface Bounds {
        min: number;
        max: number;
    }
}


export { isSourceId };
export type {
    EvictionFeatureCollection,
    EvictionFeatureProperties,
    DemographicFeatureProperties,
    DemographicFeaturePropertiesV2,
    DemographicsFeatureCollectionV2,
    HeatmapFeatureProperties,
    HeatmapFeatureCollection,
    SourceId,
    FeatureId,
    MapboxMouseEvent,
    Position,
    Range,
    FeatureProperties,
    FeatureCollections,
};
