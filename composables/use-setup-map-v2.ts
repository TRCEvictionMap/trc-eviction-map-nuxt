import mapboxgl from "mapbox-gl";

import { useMapMeta } from "~/stores/map-meta-store";
import { useFeatureState } from "~/stores/feature-state-store";
import { useDisclosures } from "~/stores/disclosures-store";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";
import type { FeatureCollections } from "~/utils/types";

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
  const controls = useMapControlsV2();
  const featureProperties = useFeaturePropertiesV2();
  const featureState = useFeatureState();
  const disclosures = useDisclosures();

  onMounted(async () => {
    const { _lngLat, _source, _year, _zoom, _d_metric, _features, _showDetails, _dates } = useInitialQueryParams();

    map.value = markRaw(
      new mapboxgl.Map({
        container: containerId,
        accessToken: config.public.mapboxAccessToken,
        style: config.public.mapboxStyleUrlLight,
        center: _lngLat,
        zoom: _zoom,
        minZoom: 7,
        maxZoom: 17,
        maxBounds: new mapboxgl.LngLatBounds(
          new mapboxgl.LngLat(-91, 42),
          new mapboxgl.LngLat(-87, 44),
        )
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
    controls.currentYear = Number.parseInt(_year);
    controls.currentChoroplethMetric = _d_metric;

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

      const [bgChoroplethJson, bgHeatmapJson] = await Promise.all([
        fetchGeoJson("block-group-choropleth") as Promise<FeatureCollections.ChoroplethV2>,
        fetchGeoJson("block-group-heatmap") as Promise<FeatureCollections.HeatmapV2>
      ]);

      featureProperties.loadChoropleth(
        controls.currentSource,
        bgChoroplethJson
      );

      featureProperties.loadHeatmap(
        controls.currentSource,
        bgHeatmapJson
      );

      controls.loadMonthEpochMap(bgHeatmapJson);

      if (
        _dates &&
        typeof controls.monthEpochMap[_dates[0]] === "number" &&
        typeof controls.monthEpochMap[_dates[1]] === "number"
      ) {
        controls.currentMonthRange = _dates;
      }

      map.value
        ?.addSource("block-group", {
          type: "geojson",
          promoteId: "id",
          data: bgChoroplethJson,
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
