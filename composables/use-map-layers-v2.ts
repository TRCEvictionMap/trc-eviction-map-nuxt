import mapboxgl from "mapbox-gl";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";

interface Layers {
  demographicsLayers: mapboxgl.AnyLayer[];
  heatmapLayers: mapboxgl.AnyLayer[];
}

function createLayers<S extends SourceId>(source: S): Layers {
  const {
    demographicsLayerId,
    demographicsBorderLayerId,
    heatmapLayerId,
  } = useLayerIds(source);

  return {
    demographicsLayers: [
      {
        source,
        id: demographicsLayerId,
        type: "fill",
        paint: {
          "fill-opacity": 0.8,
        }
      },
      {
        source,
        id: demographicsBorderLayerId,
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
              [8, 1]
            ]
          },
          // increase intensity as zoom level increases
          "heatmap-intensity": {
            stops: [
              [11, 1],
              [15, 3]
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

function useMapLayersV2(map: mapboxgl.Map) {
  const controls = useMapControls();
  const featureState = useFeatureState();
  const interpolated = useInterpolatedColorValues();

  const { demographicsLayers, heatmapLayers } = createLayers(controls.currentSource);

  const {  } = useLayerIds(controls.currentSource);

  const loadedSources = new Set<string>();

  map.on("sourcedata", (ev) => {
    if (
      !loadedSources.has(ev.sourceId) &&
      ev.sourceId === "block-group" &&
      ev.isSourceLoaded
    ) {
      loadedSources.add(ev.sourceId);
      demographicsLayers.forEach((layer) => {
        map.addLayer(layer);
      });
    }

    if (
      !loadedSources.has(ev.sourceId) &&
      ev.sourceId === "block-group-heatmap" &&
      ev.isSourceLoaded
    ) {
      loadedSources.add(ev.sourceId);
      heatmapLayers.forEach((layer) => {
        map.addLayer(layer);
      });
    }

  })

  onMounted(() => {



  })
}

export { useMapLayersV2 };
