import { type SourceId, isSourceId } from "~/utils/types";


interface QueryParams {
    _lngLat: [number, number];
    _zoom: number;
    _year: string;
    _source: SourceId;
}

function useInitialQueryParams(): QueryParams {
    const route = useRoute();

    let _lngLat: QueryParams["_lngLat"] = [-89.390, 43.1];
    let _zoom: QueryParams["_zoom"] = 10.8;
    let _source: QueryParams["_source"] = "block-group";
    let _year: QueryParams["_year"] = "2023";

    const { center, zoom, source, year } = route.query;

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

    if (isSourceId(source)) {
        _source = source;
    }

    if (typeof year === "string") {
        _year = year;
    }

    return { _lngLat, _zoom, _source, _year };
}

export { useInitialQueryParams };
