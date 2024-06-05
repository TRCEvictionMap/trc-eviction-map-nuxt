import type { SourceId } from "~/utils/types";

function useLayerIds(source: SourceId) {
    return {
        demographicsLayerId: source + "-demographics",
        demographicsBorderLayerId: source + "-demographics-border",
        evictionsLayerId: source + "-evictions",
        heatmapLayerId: source + "-heatmap",
    };
}

export { useLayerIds };