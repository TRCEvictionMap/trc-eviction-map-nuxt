import mapboxgl from "mapbox-gl";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2, type ChoroplethMetric } from "~/stores/map-controls-store-v2";
import { useInterpolatedColors } from "~/stores/interpolated-color-values-store";

interface Layer {
  layer: mapboxgl.AnyLayer;
  /**
   * The ID of an existing layer to insert the new layer before, resulting in the new layer appearing visually beneath the existing layer. If this argument is not specified, the layer will be appended to the end of the layers array and appear visually above all other layers. Note : Layers can only be rearranged within the same slot . The new layer must share the same slot as the existing layer to be positioned underneath it. If the layers are in different slots, the beforeId parameter will be ignored and the new layer will be appended to the end of the layers array. During 3D globe and terrain rendering, GL JS aims to batch multiple layers together for optimal performance. This process might lead to a rearrangement of layers. Layers draped over globe and terrain, such as fill , line , background , hillshade , and raster , are rendered first. These layers are rendered underneath symbols, regardless of whether they are placed in the middle or top slots or without a designated slot.
   * @see https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
   */
  before?: string;
}

interface Layers {
  choroplethLayers: Layer[];
  heatmapLayers: Layer[];
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
        layer: {
          source,
          id: choroplethLayerId,
          type: "fill",
          paint: {
            "fill-opacity": 0.5,
          }
        }
      },
      {
        layer: {
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
              "#656565"
            ]
          },
        },
      },
    ],
    heatmapLayers: [
      {
        layer: {
          source: `${source}-heatmap`,
          id: heatmapLayerId,
          type: "heatmap",
          maxzoom: 20,
          paint: {
            // assign color values be applied to points depending on their density
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,0,0,0)",
              0.2,
              "#ffffb2",
              0.4,
              "#fecc5c",
              0.6,
              "#fd8d3c",
              0.8,
              "#e31a1c",
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
              stops: [
                [8, 3],
                [9, 6],
                [12, 15],
                [15, 50]
              ]
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
              default: 0.5,
              stops: [
                [14, 0.75],
                [15, 0.75]
              ],
            },
          },
        },
      },
    ],
  };
}

interface AddLayersContext {
  loaded: Set<string>;
  ev: mapboxgl.MapSourceDataEvent & mapboxgl.EventData;
  map: mapboxgl.Map;
}

function addLayers(
  context: AddLayersContext,
  source: string,
  layers: Layer[]
) {
  const { loaded, map, ev: { sourceId, isSourceLoaded } } = context;

  if (!loaded.has(sourceId) && sourceId === source && isSourceLoaded) {
    loaded.add(sourceId);
    layers.forEach(({ layer, before }) => {
      map.addLayer(layer, before);
    });
  }
}

function removeLayers(map: mapboxgl.Map, layers: Layer[]) {
  layers.forEach(({ layer }) => {
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
  const interpolated = useInterpolatedColors();

  const { choroplethLayers, heatmapLayers } = createLayers(controls.currentSource);

  const { choroplethLayerId, heatmapLayerId } = useLayerIds(controls.currentSource);

  const loaded = new Set<string>();

  map.on("sourcedata", async (ev) => {
    const context = { map, ev, loaded };

    addLayers(context, "block-group", choroplethLayers);
    addLayers(context, "block-group-heatmap", heatmapLayers);

    updateChoroplethPaintProperties(controls.currentChoroplethMetric);
    updateSelectedFeatures(featureState.selectedFeatures);
    updateHeatmapTimeFilter(controls.currentMonthRange);

    map.on("click", choroplethLayerId, handleMapClick);
    map.on("mousemove", choroplethLayerId, handleMapMousemove);
    map.on("mouseleave", choroplethLayerId, handleMapMouseleave);
  });

  onBeforeUnmount(() => {
    removeLayers(map, choroplethLayers);
    removeLayers(map, heatmapLayers);

    updateSelectedFeatures([], featureState.selectedFeatures);

    featureState.clearSelectedFeatures();
    featureState.clearHoveredFeature();

    map.off("click", choroplethLayerId, handleMapClick);
    map.off("mousemove", choroplethLayerId, handleMapMousemove);
    map.off("mouseleave", choroplethLayerId, handleMapMouseleave);
  });

  watch(
    () => featureState.selectedFeatures,
    updateSelectedFeatures,
    { immediate: true }
  );

  watch(
    () => controls.currentChoroplethMetric,
    updateChoroplethPaintProperties,
    { immediate: true }
  );

  watch(
    () => controls.currentMonthRange,
    updateHeatmapTimeFilter,
    { immediate: true }
  );

  watch(() => featureState.hoveredFeature, (current, prev) => {
    if (prev) {
      map.setFeatureState(
        { source: controls.currentSource, id: prev },
        { isHovered: false }
      );
    }
    if (current) {
      map.setFeatureState(
        { source: controls.currentSource, id: current },
        { isHovered: true }
      );
    }
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

  function updateHeatmapTimeFilter(monthRange: [string, string]) {
    if (map.getLayer(heatmapLayerId)) {
      const [startMonth, endMonth] = monthRange;

      map.setFilter(heatmapLayerId, [
        "all",
        [">=", ["get", "e"], controls.monthEpochMap[startMonth]],
        ["<=", ["get", "e"], controls.monthEpochMap[endMonth]],
      ])
    }
  }

  function updateIsSelected(featureId: string, isSelected: boolean) {
    if (map.getLayer(choroplethLayerId)) {
      map.setFeatureState(
        { source: controls.currentSource, id: featureId },
        { isSelected },
      );
    }
  }

  function updateSelectedFeatures(current: string[], previous?: string[]) {
    previous
      ?.filter((featureId) => !current.includes(featureId))
      .forEach((featureId) => {
        updateIsSelected(featureId, false);
      });

    current
      .filter((featureId) => !previous?.includes(featureId))
      .forEach((featureId) => {
        updateIsSelected(featureId, true);
      });
  }

  // TODO: `clickLock` is a hack that breaks sometimes when dev-server reloads – likely
  // related to component mounting and unmounting while Promise is pending...Issue not
  // observed in any other context so far...
  let clickLock = false;
  async function handleMapClick(ev: MapboxMouseEvent<true>) {
    if (!clickLock && ev.features && ev.features.length) {
      clickLock = true;
      const justClicked = ev.features[0].id?.toString() ?? "";
      featureState.setFeatureState(
        justClicked,
        "isSelected",
        !featureState.selectedFeatures.includes(justClicked)
      );
    }
    await nextTick();
    clickLock = false;
  }

  function handleMapMouseleave(ev: MapboxMouseEvent<true>) {
    featureState.clearHoveredFeature();
  }

  function handleMapMousemove(ev: MapboxMouseEvent<true>) {
    if (ev.features && ev.features.length > 0) {
      const hovered = ev.features[0].id?.toString() ?? "";
      featureState.setFeatureState(hovered, "isHovered", "feature");
    }
  }
}

export { useMapLayersV2 };
