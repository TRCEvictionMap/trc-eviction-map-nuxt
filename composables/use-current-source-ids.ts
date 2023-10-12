import { useMapControls } from "~/stores/map-controls-store";
import { SourceId } from "utils/types";

interface SourceIds {
    baseSourceId: SourceId;
    areaSourceId: `${SourceId}-area`;
    evictionsSourceId: `${SourceId}-evictions`;
}

function useCurrentSourceIds() {
    const controls = useMapControls();

    const sourceIds = reactive({
        areaSourceId: "",
        evictionsSourceId: "",
        baseSourceId: "" as SourceId,
    });

    watch(() => controls.currentSource, (currentSource) => {
        sourceIds.areaSourceId = currentSource + "-area";
        sourceIds.evictionsSourceId = currentSource + "-evictions";
        sourceIds.baseSourceId = currentSource;
    }, { immediate: true });

    return sourceIds as SourceIds;
}

export { useCurrentSourceIds };