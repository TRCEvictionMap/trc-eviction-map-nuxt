import { defineStore } from "pinia";
import { SourceId } from "utils/types";

const useMapControls = defineStore("map-controls", () => {
    const sourceOptions: SourceId[] = [
        "alder-districts",
        "block-groups",
        "zip-codes",
    ];

    const currentSource = ref<SourceId>("alder-districts");

    return {
        sourceOptions,
        currentSource,
    };
});

export { useMapControls };
