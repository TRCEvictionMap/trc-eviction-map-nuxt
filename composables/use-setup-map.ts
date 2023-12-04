import mapboxgl from "mapbox-gl";
import { useMapMeta } from "~/stores/map-meta-store";

import blockGroupJson from "~/geojson/block-group.json";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";
import type { EvictionFeatureCollection } from "~/utils/types";

function useSetupMap() {
    const map = ref<mapboxgl.Map>();

    const config = useRuntimeConfig();
    const mapMeta = useMapMeta();
    const controls = useMapControls();
    const featureProperties = useFeatureProperties();
    const featureState = useFeatureState();

    onMounted(() => {
        const { _lngLat, _source, _year, _zoom, _d_metric, _e_metric, _features } = useInitialQueryParams();

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
            "top-right"
        );

        mapMeta.lngLat = _lngLat;
        mapMeta.zoom = _zoom;
        controls.currentSource = _source;
        controls.currentYear = _year;
        controls.currentDemographicMetric = _d_metric;
        controls.currentEvictionMetric = _e_metric;
        
        featureState.initSelectedFeatures(_features);

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
                promoteId: "id",
                data: blockGroupJson as unknown as string,
            });
        });

        const years = featureProperties.loadData(
            "block-group",
            blockGroupJson as unknown as EvictionFeatureCollection
        );

        controls.yearOptions = years
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((year) => ({ value: year }));

    });

    return map;
}

export { useSetupMap };
