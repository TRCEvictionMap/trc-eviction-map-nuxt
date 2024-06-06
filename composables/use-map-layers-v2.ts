import mapboxgl from "mapbox-gl";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2, type ChoroplethMetric} from "~/stores/map-controls-store-v2";
import { useInterpolatedColors } from "~/stores/interpolated-color-values-store";

interface Layers {
  choroplethLayers: mapboxgl.AnyLayer[];
  heatmapLayers: mapboxgl.AnyLayer[];
}

function createLayers<S extends SourceId>(source: S): Layers {
  const {
    choroplethLayerId,
    choroplethBorderLayerId,
    heatmapLayerId,
  } = useLayerIds(source);

  return {
    choroplethLayers: [
      {
        source,
        id: choroplethLayerId,
        type: "fill",
        paint: {
          "fill-opacity": 0.5,
        }
      },
      {
        source,
        id: choroplethBorderLayerId,
        type: "line",
        paint: {
          "line-width": [
            "case",
            ["boolean", ["feature-state", "isSelected"], false],
            4,
            [
              "case",
              ["boolean", ["feature-state", "isHovered"], false],
              2,
              1
            ]
          ],
          "line-color": [
            "case",
            ["boolean", ["feature-state", "isHovered"], false],
            "black",
            "gray"
          ]
        }
      }
    ],
    heatmapLayers: [
      {
        source: `${source}-heatmap`,
        id: heatmapLayerId,
        type: "heatmap",
        maxzoom: 20,
        paint: {
          // increase weight as diameter breast height increases
          "heatmap-weight": {
            property: "count",
            type: "exponential",
            stops: [
              [1, 0],
              [2, 0.2],
              [4, 0.4],
              [6, 1],
            ]
          },
          // increase intensity as zoom level increases
          "heatmap-intensity": {
            stops: [
              [2, 1],
              [4, 2],
              [6, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            interpolateOrange(0),
            // "rgba(236,222,239,0)",
            0.2,
            interpolateOrange(0.2),
            // "rgb(208,209,230)",
            0.4,
            interpolateOrange(0.4),
            // "rgb(166,189,219)",
            0.6,
            interpolateOrange(0.6),
            // "rgb(103,169,207)",
            0.8,
            interpolateOrange(0.8),
            // "rgb(28,144,153)"
          ],
          // increase radius as zoom increases
          "heatmap-radius": {
            stops: [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          "heatmap-opacity": {
            default: 1,
            stops: [
              [14, 1],
              [15, 0]
            ]
          }
        }
      }
    ]
  }
}

interface AddLayersContext {
  loaded: Set<string>;
  ev: mapboxgl.MapSourceDataEvent & mapboxgl.EventData;
  map: mapboxgl.Map;
}

function addLayers(
  context: AddLayersContext,
  source: string,
  layers: mapboxgl.AnyLayer[]
) {
  const { loaded, map, ev: { sourceId, isSourceLoaded} } = context;

  if (!loaded.has(sourceId) && sourceId === source && isSourceLoaded) {
    loaded.add(sourceId);
    layers.forEach((layer) => {
      map.addLayer(layer);
    });
  }
}

function removeLayers(map: mapboxgl.Map, layers: mapboxgl.AnyLayer[]) {
  layers.forEach((layer) => {
    map.removeLayer(layer.id);
  });
}

const CHOROPLETH_METRIC_GEOJSON_PROPERTY_MAP: Partial<Record<ChoroplethMetric, keyof DemographicFeaturePropertiesV2>> = {
  renter_count: "rc",
  renter_rate: "rr",
  poverty_rate: "pr",
};

function useMapLayersV2(map: mapboxgl.Map) {
  const controls = useMapControlsV2();
  const featureState = useFeatureState();
  const interpolated = useInterpolatedColors()

  const { choroplethLayers, heatmapLayers } = createLayers(controls.currentSource);

  const { choroplethLayerId } = useLayerIds(controls.currentSource);

  const loaded = new Set<string>();

  map.on("sourcedata", async (ev) => {
    const context = { map, ev, loaded };

    addLayers(context, "block-group", choroplethLayers);
    // addLayers(context, "block-group-heatmap", heatmapLayers);

    updateChoroplethPaintProperties(controls.currentChoroplethMetric);
  });

  onBeforeUnmount(() => {
    removeLayers(map, choroplethLayers);
    // removeLayers(map, heatmapLayers);

  });

  function updateChoroplethPaintProperties(metric: ChoroplethMetric) {
    if (!map.getLayer(choroplethLayerId)) {
      return;
    }

    if (metric !== "none") {
      map.setLayoutProperty(choroplethLayerId, "visibility", "visible");
      map.setPaintProperty(
        choroplethLayerId,
        "fill-color",
        [
          "interpolate",
          ["linear"],
          ["number", ["get", CHOROPLETH_METRIC_GEOJSON_PROPERTY_MAP[metric], ["properties"]]],
          ...interpolated.choropleth[metric]
        ]
      );
    } else {
      map.setLayoutProperty(choroplethLayerId, "visibility", "none");
    }
  }
}

export { useMapLayersV2 };
