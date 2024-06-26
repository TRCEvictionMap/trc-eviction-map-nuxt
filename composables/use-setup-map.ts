import mapboxgl from "mapbox-gl";

// import blockGroupJson from "~/geojson/block-group.json";
import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";
import type { EvictionFeatureCollection } from "~/utils/types";
import { useDisclosures } from "~/stores/disclosures-store";

interface SetupMapOptions {
  containerId: string;
  navControlPosition?: Position;
}

function useSetupMap(options: SetupMapOptions) {
  const { containerId, navControlPosition } = options;
  
  const map = ref<mapboxgl.Map>();

  const config = useRuntimeConfig();
  const mapMeta = useMapMeta();
  const controls = useMapControls();
  const featureProperties = useFeatureProperties();
  const featureState = useFeatureState();
  const disclosures = useDisclosures();

  onMounted(() => {
    const { _lngLat, _source, _year, _zoom, _d_metric, _e_metric, _features, _showDetails } = useInitialQueryParams();

    map.value = markRaw(
      new mapboxgl.Map({
        container: containerId,
        accessToken: config.public.mapboxAccessToken,
        style: config.public.mapboxStyleUrlLight,
        center: _lngLat,
        zoom: _zoom,
      })
    );

    map.value.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      navControlPosition ?? "top-right"
    );

    mapMeta.lngLat = _lngLat;
    mapMeta.zoom = _zoom;
    controls.currentSource = _source;
    controls.currentYear = _year;
    controls.currentDemographicMetric = _d_metric;
    controls.currentEvictionMetric = _e_metric;

    featureState.initSelectedFeatures(_features);

    disclosures.showDetails = _showDetails;

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
        data: {} as unknown as string,
      });
    });

    const years = featureProperties.loadData(
      "block-group",
      "blockGroupJson" as unknown as EvictionFeatureCollection
    );

    controls.yearOptions = years
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((year) => ({ value: year }));

  });

  return map;
}

export { useSetupMap };
