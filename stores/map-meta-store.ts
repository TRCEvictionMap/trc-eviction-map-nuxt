import { defineStore } from "pinia";

interface QueryParams {
    _lngLat: [number, number];
    _zoom: number;
}

function useInitialQueryParams(): QueryParams {
    const route = useRoute();

    let _lngLat: QueryParams["_lngLat"] = [-89.390, 43.1];
    let _zoom: QueryParams["_zoom"] = 10.8;

    const { center, zoom } = route.query;

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

    return { _lngLat, _zoom };
}

const useMapMeta = defineStore("map-meta", () => {
    const { _lngLat, _zoom } = useInitialQueryParams();

    const lngLat = ref<[number, number]>(_lngLat);
    const zoom = ref<number>(_zoom);

    return { lngLat, zoom };
});

export { useMapMeta };
