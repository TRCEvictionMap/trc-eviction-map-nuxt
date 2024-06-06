import type { SourceId } from "~/utils/types";

function useLayerIds(source: SourceId) {
    return {
        demographicsLayerId: source + "-demographics",
        demographicsBorderLayerId: source + "-demographics-border",
        choroplethLayerId: source + "-choropleth",
        choroplethBorderLayerId: source + "-choropleth-border",
        evictionsLayerId: source + "-evictions",
        heatmapLayerId: source + "-heatmap",
    };
}

export { useLayerIds };