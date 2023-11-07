import { type EvictionMetric, type DemographicMetric, isDemographicMetric, isEvictionMetric } from "~/stores/map-controls-store";
import { type SourceId, isSourceId } from "~/utils/types";


interface QueryParams {
    _lngLat: [number, number];
    _zoom: number;
    _year: string;
    _source: SourceId;
    _e_metric: EvictionMetric;
    _d_metric: DemographicMetric;
    _features: string[];
}

function useInitialQueryParams(): QueryParams {
    const route = useRoute();

    let _lngLat: QueryParams["_lngLat"] = [-89.390, 43.1];
    let _zoom: QueryParams["_zoom"] = 10.8;
    let _source: QueryParams["_source"] = "block-group";
    let _year: QueryParams["_year"] = "2023";
    let _d_metric: QueryParams["_d_metric"] = "renter_count";
    let _e_metric: QueryParams["_e_metric"] = "n_filings";
    let _features: QueryParams["_features"] = [];

    const { center, zoom, source, year, d_metric, e_metric, features } = route.query;

    if (center) {
        const [lng, lat] = (route.query.center as string).split(",");
        _lngLat = [
            Number.parseFloat(lng),
            Number.parseFloat(lat),
        ];
    }

    if (zoom) {
        _zoom = Number.parseFloat(zoom as string);
    }

    if (typeof year === "string" && /^\d{4}$/.test(year.trim())) {
        _year = year.trim();
    }

    if (isSourceId(source)) {
        _source = source;
    }

    if (isDemographicMetric(d_metric)) {
        _d_metric = d_metric;
    }

    if (isEvictionMetric(e_metric)) {
        _e_metric = e_metric;
    }

    if (typeof features === "string") {
        _features = features.split(",");
    }

    return { _lngLat, _zoom, _source, _year, _d_metric, _e_metric, _features };
}

export { useInitialQueryParams };
