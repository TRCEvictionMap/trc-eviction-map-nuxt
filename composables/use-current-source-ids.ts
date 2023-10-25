import { useMapControls } from "~/stores/map-controls-store";
import type { SourceId } from "utils/types";

interface SourceIds {
    baseSourceId: SourceId;
    areaSourceId: `${SourceId}-area`;
    evictionsSourceId: `${SourceId}-evictions`;
}

function useCurrentSourceIds() {
    const controls = useMapControls();

    const sourceIds = computed(() => ({
        areaSourceId: controls.currentSource + "-area",
        evictionsSourceId: controls.currentSource + "-evictions",
        baseSourceId: controls.currentSource
    }));

    return sourceIds.value as SourceIds;
}

export { useCurrentSourceIds };