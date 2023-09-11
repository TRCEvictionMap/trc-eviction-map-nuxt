import { defineStore } from "pinia";
import { SourceId } from "utils/types";

const useMapControls = defineStore("map-controls", () => {
    const sourceOptions: SourceId[] = [
        "alder-districts",
        "block-groups",
        "zip-codes",
    ];

    const route = useRoute();

    const currentSource = ref<SourceId>(
        sourceOptions.includes(route.query.source as SourceId)
            ? route.query.source as SourceId
            : "alder-districts"
    );

    return {
        sourceOptions,
        currentSource,
    };
});

export { useMapControls };
