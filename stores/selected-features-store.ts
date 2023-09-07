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
            if (_items.value.includes(justClicked)) {
                _items.value = _items.value.filter((id) => id !== justClicked);
            }
            else {
                _items.value = _items.value.concat(justClicked);
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
