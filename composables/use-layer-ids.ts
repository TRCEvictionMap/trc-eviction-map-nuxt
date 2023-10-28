import type { SourceId } from "utils/types";

function useLayerIds(source: SourceId) {
    return {
        demographicsLayerId: source + "-demographics",
        demographicsShadingLayerId: source + "-demographics-shading",
        demographicsBorderLayerId: source + "-demographics-border",
        evictionsLayerId: source + "-evictions" 
    };
}

export { useLayerIds };