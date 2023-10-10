import { useMapControls } from "~/stores/map-controls-store";
import { SourceId } from "utils/types";

function useCurrentSourceIds() {
    const controls = useMapControls();

    const sourceIds = reactive({
        areaSourceId: "",
        evictionsSourceId: "",
    });

    watch(() => controls.currentSource, (currentSource) => {
        sourceIds.areaSourceId = currentSource + "-area";
        sourceIds.evictionsSourceId = currentSource + "-evictions";
    }, { immediate: true });

    return sourceIds;
}

export { useCurrentSourceIds };