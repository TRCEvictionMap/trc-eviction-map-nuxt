import { defineStore } from "pinia";
import type { MapboxMouseEvent } from "~/utils/types";

const useSelectedFeatures = defineStore("selected-features", () => {
    const route = useRoute();

    const _items = ref<string[]>(
        typeof route.query.features === "string"
            ? route.query.features.split(",")
            : []
    );

    const items = computed(() => _items.value.reduce(
        (accum: string[], featureId, index) => {
            if (index >= _items.value.length - 3) {
                accum.push(featureId);
            }
            return accum;
        },
        []
    ));

    function clear() {
        _items.value = [];
    }

    function deselect(featureId: string) {
        _items.value = _items.value.filter((id) => id !== featureId);
    }

    function handleMapClick(ev: MapboxMouseEvent<true>) {
        if (ev.features && ev.features.length > 0) {
            const justClicked = ev.features[0].id?.toString() ?? ""
            
            if (_items.value.includes(justClicked)) {
                deselect(justClicked);
            }
            else {
                _items.value = _items.value.concat(justClicked);
            }

            if (_items.value.length > 3) {
                // _items.value.splice(0, _items.value.length - 3);
            }
        }
    }

    return {
        items,
        deselect,
        clear,
        handleMapClick,
    };
});

export { useSelectedFeatures };
