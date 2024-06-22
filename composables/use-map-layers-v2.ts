import mapboxgl from "mapbox-gl";
import { useFeatureState, type FeatureColors } from "~/stores/feature-state-store";
import { useMapControlsV2, type ChoroplethMetric } from "~/stores/map-controls-store-v2";
import { useInterpolatedColors } from "~/stores/interpolated-color-values-store";
import { useFeatureFlags } from "~/stores/feature-flags";

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
  const flags = useFeatureFlags();

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
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "isHovered"], false],
              1,
              0.8,
            ],
            "line-color": ["string", ["feature-state", "lineColor"], "#656565"],
            "line-offset": [
              "case",
              ["boolean", ["==", ["typeof", ["feature-state", "lineColor"]], "string"], false],
              flags.disableMultiColorFeatureOutline ? 0 : 2,
              0
            ],
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
  
    return true;
  }
  
  return false;
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
  const flags = useFeatureFlags();
  const controls = useMapControlsV2();
  const featureState = useFeatureState();
  const interpolated = useInterpolatedColors();

  const { choroplethLayers, heatmapLayers } = createLayers(controls.currentSource);

  const { choroplethLayerId, choroplethBorderLayerId, heatmapLayerId } = useLayerIds(controls.currentSource);

  const loaded = new Set<string>();

  map.on("sourcedata", async (ev) => {
    const context = { map, ev, loaded };

    // TODO: instead of loading layers as soon as their source data is available,
    // queue up layers whose sources have been added and THEN add layers in a
    // guaranteed proper order..."block-group-heatmap" currently occaisionally
    // seems to load before "block-group", resulting in heatmap stuff showing up
    // behind choropleth stuff
    if (addLayers(context, "block-group", choroplethLayers)) {
      updateChoroplethLayerFeatureState(featureState.selectedFeatures);
      updateChoroplethPaintProperties(controls.currentChoroplethMetric);
      updateChoroplethBorderLayerFeatureState(featureState.selectedFeatureColors);
    }

    if (addLayers(context, "block-group-heatmap", heatmapLayers)) {
      updateHeatmapTimeFilter(controls.currentMonthRange);
    }
  });

  onMounted(() => {
    map.on("click", choroplethLayerId, handleMapClick);
    map.on("mousemove", choroplethLayerId, handleMapMousemove);
    map.on("mouseleave", choroplethLayerId, handleMapMouseleave);
  });

  onBeforeUnmount(() => {
    removeLayers(map, choroplethLayers);
    removeLayers(map, heatmapLayers);

    updateChoroplethLayerFeatureState([], featureState.selectedFeatures);

    featureState.clearSelectedFeatures();
    featureState.clearHoveredFeature();

    map.off("click", choroplethLayerId, handleMapClick);
    map.off("mousemove", choroplethLayerId, handleMapMousemove);
    map.off("mouseleave", choroplethLayerId, handleMapMouseleave);
  });

  watch(
    () => featureState.selectedFeatures,
    updateChoroplethLayerFeatureState,
    { immediate: true }
  );

  watch(
    () => controls.currentChoroplethMetric,
    updateChoroplethPaintProperties,
    { immediate: true }
  );

  watch(
    () => featureState.selectedFeatureColors,
    updateChoroplethBorderLayerFeatureState,
    { immediate: true }
  )

  watch(
    () => controls.currentMonthRange,
    updateHeatmapTimeFilter,
    { immediate: true }
  );

  watch(() => featureState.hoveredFeature, (current, previous) => {
    if (previous) {
      setFeatureState(previous, { isHovered: false });
    }
    if (current) {
      setFeatureState(current, { isHovered: true });
    }
  });

  function updateChoroplethPaintProperties(metric: ChoroplethMetric) {
    if (map.getLayer(choroplethLayerId)) {
      if (metric !== "none") {
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
        map.setPaintProperty(choroplethLayerId, "fill-color", "transparent")
      }
    }
  }

  function updateChoroplethBorderLayerFeatureState(
    current: FeatureColors,
    previous?: FeatureColors
  ) {
    if (map.getLayer(choroplethBorderLayerId)) {
      Object.entries(previous ?? []).forEach(([featureId]) => {
        setFeatureState(featureId, { lineColor: null });
      });

      Object.entries(current).forEach(([featureId, color]) => {
        setFeatureState(featureId, { lineColor: flags.disableMultiColorFeatureOutline ? "black" : color });
      });
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

  function updateChoroplethLayerFeatureState(current: string[], previous?: string[]) {
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

  async function handleMapClick(ev: MapboxMouseEvent<true>) {
    if (ev.features && ev.features.length) {
      const justClicked = ev.features[0].id?.toString() ?? "";
      featureState.setFeatureState(
        justClicked,
        "isSelected",
        !featureState.selectedFeatures.includes(justClicked)
      );
    }
  }

  function setFeatureState(featureId: string, state: Record<string, any>) {
    map.setFeatureState(
      { source: controls.currentSource, id: featureId },
      state
    );
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
