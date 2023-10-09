import { defineStore } from "pinia";
import { SourceId } from "utils/types";

const useMapControls = defineStore("map-controls", () => {
    const sourceOptions: SourceId[] = [
        "alder-districts",
        "block-group",
        "zip-codes",
    ];


    const currentYear = ref<string>("2023");
    const currentSource = ref<SourceId>("block-group");

    return {
        sourceOptions,
        currentSource,
        currentYear,
    };
});

export { useMapControls };
