import mapboxgl from "mapbox-gl";
import { useMapMeta } from "~/stores/map-meta-store";

import blockGroupJson from "~/public/block-group.json";
import { useMapControls } from "~/stores/map-controls-store";

function useSetupMap() {
    const map = ref<mapboxgl.Map>();

    const config = useRuntimeConfig();
    const mapMeta = useMapMeta();
    const mapControls = useMapControls();

    onMounted(() => {
        const { _lngLat, _source, _year, _zoom } = useInitialQueryParams();

        map.value = new mapboxgl.Map({
            container: "the-map",
            accessToken: config.public.mapboxAccessToken,
            style: config.public.mapboxStyleUrlLight,
            center: _lngLat,
            zoom: _zoom,
        });

        map.value.addControl(
            new mapboxgl.NavigationControl({
                visualizePitch: true,
            }),
            "bottom-right"
        );

        mapMeta.lngLat = _lngLat;
        mapMeta.zoom = _zoom;
        mapControls.currentSource = _source;
        mapControls.currentYear = _year;

        map.value.on("moveend", (ev) => {
            const { lng, lat } = ev.target.getCenter();
            mapMeta.lngLat = [lng, lat];
        });
    
        map.value.on("zoomend", (ev) => {
            mapMeta.zoom = ev.target.getZoom();
        });

        map.value.on("load", () => {
            const _map = map.value as mapboxgl.Map;

            _map.addSource("block-group", {
                type: "geojson",
                data: blockGroupJson as unknown as string,
            });
        });
    });

    return map;
}

export { useSetupMap };
