import { defineStore } from "pinia";

type HoveredFeatureKind = "feature" | "card" | false;

interface FeatureState {
    isHovered: HoveredFeatureKind;
    isSelected: boolean;
}

function useSelectedFeatures() {
    const route = useRoute();

    const _features = ref<string[]>(
        typeof route.query.features === "string"
            ? route.query.features.split(",")
            : []
    );

    const selectedFeatures = computed(() => _features.value.reduce(
        (accum: string[], featureId, index) => {
            if (index >= _features.value.length - 3) {
                accum.push(featureId);
            }
            return accum;
        },
        []
    ));

    function clearSelectedFeatures() {
        _features.value = [];
    }

    function setIsFeatureSelected(featureId: string, isSelected: boolean) {
        if (isSelected) {
            _features.value = _features.value.concat(featureId);
        } else {
            _features.value = _features.value.filter((id) => id !== featureId);
        }

        if (_features.value.length > 3) {
            _features.value.splice(0, _features.value.length - 3);
        }
    }

    return { selectedFeatures, clearSelectedFeatures, setIsFeatureSelected };
}

function useHoveredFeature() {
    const hoveredFeature = ref<string>();
    const hoveredFeatureKind = ref<HoveredFeatureKind>(false);

    function setIsFeatureHovered(featureId: string, isHovered: FeatureState["isHovered"]) {
        hoveredFeature.value = isHovered ? featureId : undefined;
        hoveredFeatureKind.value = isHovered;
    }

    function clearHoveredFeature() {
        hoveredFeature.value = undefined;
        hoveredFeatureKind.value = false;
    }

    return {
        setIsFeatureHovered,
        clearHoveredFeature,
        hoveredFeature,
        hoveredFeatureKind,
    };
}

const useFeatureState = defineStore("feature-state", () => {
    const { selectedFeatures, setIsFeatureSelected, clearSelectedFeatures } = useSelectedFeatures();
    const { hoveredFeature, hoveredFeatureKind, setIsFeatureHovered, clearHoveredFeature } = useHoveredFeature();

    function setFeatureState<Key extends keyof FeatureState>(
        featureId: string,
        key: Key,
        value: FeatureState[Key]
    ) {
        if (key === "isSelected") {
            setIsFeatureSelected(featureId, value as FeatureState["isSelected"]);
        }
        if (key === "isHovered") {
            setIsFeatureHovered(featureId, value as FeatureState["isHovered"]);
        }
    }

    return { selectedFeatures, hoveredFeature, hoveredFeatureKind, setFeatureState, clearSelectedFeatures, clearHoveredFeature };
});

export { useFeatureState };
