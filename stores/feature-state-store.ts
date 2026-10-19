import { defineStore } from "pinia";
import { useFeatureFlags } from "./feature-flags";

type HoveredFeatureKind = "feature" | "card" | "table-row" | false;

interface FeatureState {
  isHovered: HoveredFeatureKind;
  isSelected: boolean;
}

const FEATURE_COLOR = ["#ff7f00", "#4daf4a", "#984ea3"] as const;

type FeatureColor = typeof FEATURE_COLOR[number];
type FeatureColors = Record<string, FeatureColor>;

const MAX_SELECTED_FEATURES = 3;

function useSelectedFeatures() {
  const flags = useFeatureFlags();

  const _features = ref<string[]>([]);
  const _featureColors = ref<FeatureColors>({});

  const selectedFeatureColors = computed(() => {
    if (flags.disableMultiColorFeatureOutline) {
      return {};
    }
    
    return Object.fromEntries(
      Object.entries(_featureColors.value).map(([featureId, color]) => [
        featureId,
        color
      ])
    );
  });

  const selectedFeatures = computed({
    get() {
      return _features.value;
    },
    set(features) {
      _features.value = features.length > MAX_SELECTED_FEATURES
        ? features.slice(features.length - MAX_SELECTED_FEATURES)
        : features;
    }
  });

  watch(selectedFeatures, (selectedFeatures) => {
    const { featureColors, availableColors } = Object
      .entries(_featureColors.value)
      .reduce(
        (accum, [featureId, color]) => {
          if (selectedFeatures.includes(featureId)) {
            accum.featureColors[featureId] = color;
            accum.availableColors = accum.availableColors.filter(
              (c) => c !== color
            );
          }
          return accum;
        },
        { featureColors: {}, availableColors: Array.from(FEATURE_COLOR) } as
        { featureColors: FeatureColors; availableColors: FeatureColor[] }
      );

    selectedFeatures.forEach((featureId) => {
      if (!featureColors[featureId]) {
        featureColors[featureId] = availableColors.pop() as FeatureColor;
      }
    });

    _featureColors.value = featureColors;
  }, { immediate: true });

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

  return { selectedFeatures, initSelectedFeatures, clearSelectedFeatures, setIsFeatureSelected, _features, selectedFeatureColors };
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
  const { selectedFeatures, setIsFeatureSelected, clearSelectedFeatures, initSelectedFeatures, _features, selectedFeatureColors } = useSelectedFeatures();
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
    _features,
    selectedFeatureColors,
  };
});

export { useFeatureState };
export type { FeatureColors };
