import mapboxgl from "mapbox-gl";

// import bgDemographicsJson from "~/geojson/block-group-demographics.json";
// import bgHeatmapJson from "~/geojson/block-group-heatmap.json";
import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureState } from "~/stores/feature-state-store";
import type { EvictionFeatureCollection } from "~/utils/types";
import { useDisclosures } from "~/stores/disclosures-store";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";

interface SetupMapOptions {
  containerId: string;
  navControlPosition?: Position;
}

async function fetchGeoJson(filename: string) {
  const response = await fetch(`/${filename}.json`);
  return await response.json();
}

function useSetupMapV2(options: SetupMapOptions) {
  const { containerId, navControlPosition } = options;

  const map = ref<mapboxgl.Map>();

  const config = useRuntimeConfig();
  const mapMeta = useMapMeta();
  const controls = useMapControls();
  const featureProperties = useFeaturePropertiesV2();
  const featureState = useFeatureState();
  const disclosures = useDisclosures();

  onMounted(async () => {
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

    map.value.on("load", async () => {

      const [bgDemographicsJson, bgHeatmapJson] = await Promise.all([
        fetchGeoJson("block-group-demographics"),
        fetchGeoJson("block-group-heatmap")
      ]);

      featureProperties.loadDemographics(
        controls.currentSource,
        bgDemographicsJson
      );

      featureProperties.loadHeatmap(
        controls.currentSource,
        bgHeatmapJson
      );

      map.value
        ?.addSource("block-group", {
          type: "geojson",
          promoteId: "id",
          data: bgDemographicsJson,
        })
        .addSource("block-group-heatmap", {
          type: "geojson",
          promoteId: "id",
          data: bgHeatmapJson,
        });
    });

  });

  return map;

}

export { useSetupMapV2 };
