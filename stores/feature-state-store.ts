import { defineStore } from "pinia";

type HoveredFeatureKind = "feature" | "card" | "table-row" | false;

interface FeatureState {
    isHovered: HoveredFeatureKind;
    isSelected: boolean;
}

const MAX_SELECTED_FEATURES = 3;

function useSelectedFeatures() {
    const _features = ref<string[]>([]);

    const selectedFeatures = computed({
        get() {
            return _features.value;
        },
        set(features) {
            _features.value = features.length > MAX_SELECTED_FEATURES
                ? features.slice(features.length - MAX_SELECTED_FEATURES)
                : features;
        }
    })

    function initSelectedFeatures(features: string[]) {
        _features.value = features;
    }

    function clearSelectedFeatures() {
        _features.value = [];
    }

    function setIsFeatureSelected(featureId: string, isSelected: boolean) {
        if (isSelected) {
            selectedFeatures.value = selectedFeatures.value.concat(featureId);
        } else {
            selectedFeatures.value = selectedFeatures.value.filter((id) => id !== featureId);
        }
    }

    return { selectedFeatures, initSelectedFeatures, clearSelectedFeatures, setIsFeatureSelected, _features };
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
    const { selectedFeatures, setIsFeatureSelected, clearSelectedFeatures, initSelectedFeatures, _features } = useSelectedFeatures();
    const { hoveredFeature, hoveredFeatureKind, setIsFeatureHovered, clearHoveredFeature } = useHoveredFeature();

    function setFeatureState<State extends keyof FeatureState>(
        featureId: string,
        state: State,
        value: FeatureState[State]
    ) {
        if (state === "isSelected") {
            setIsFeatureSelected(featureId, value as FeatureState["isSelected"]);
        }
        if (state === "isHovered") {
            setIsFeatureHovered(featureId, value as FeatureState["isHovered"]);
        }
    }

    return {
        selectedFeatures,
        hoveredFeature,
        hoveredFeatureKind,
        setFeatureState,
        clearSelectedFeatures,
        clearHoveredFeature,
        initSelectedFeatures,
        _features
    };
});

export { useFeatureState };
