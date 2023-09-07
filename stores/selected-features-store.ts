import { defineStore } from "pinia";
import type { FeatureId, MapboxMouseEvent } from "~/utils/types";

const useSelectedFeatures = defineStore("selected-features", () => {
    const _items = ref<FeatureId[]>([]);

    const items = computed(() => _items.value.reduce(
        (accum: FeatureId[], featureId, index) => {
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
            const [{ id: justClicked }] = ev.features;
            const indexOfJustClicked = _items.value.indexOf(justClicked);
            if (indexOfJustClicked > -1) {
                _items.value.splice(indexOfJustClicked, 1);
            }
            else {
                _items.value.push(justClicked);
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
