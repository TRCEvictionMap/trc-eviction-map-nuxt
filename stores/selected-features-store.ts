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

    function handleMapClick(ev: MapboxMouseEvent<true>) {
        if (ev.features && ev.features.length > 0) {
            const justClicked = ev.features[0].id?.toString() ?? ""
            if (_items.value.includes(justClicked)) {
                _items.value = _items.value.filter((id) => id !== justClicked);
            }
            else {
                _items.value = _items.value.concat(`${justClicked}`);
            }
        }
    }

    return {
        items,
        clear,
        handleMapClick,
    };
});

export { useSelectedFeatures };
