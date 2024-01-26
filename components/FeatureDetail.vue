<script setup lang="ts">
import { useFeatureProperties, type FeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";

const controls = useMapControls();
const featureState = useFeatureState();
const featureProperties = useFeatureProperties();

const { featureId } = defineProps<{ featureId: string }>();

const feature = computed(() => {
  const { evictions, id, ...properties } = featureProperties.getFeatureProperties(
    controls.currentSource,
    featureId
  ) as FeatureProperties;

  return {
    ...properties,
    ...evictions[controls.currentYear],
    id: id.replace(/\w_/, ""),
  };
});

const isHovered = computed(() => featureState.hoveredFeature === featureId);

function closeCard() {
  if (featureId) {
    featureState.setFeatureState(featureId, "isSelected", false);
    featureState.setFeatureState(featureId, "isHovered", false);
  }
}

function onMouseover() {
  featureState.setFeatureState(featureId, "isHovered", "card");
}

function onMouseleave() {
  featureState.setFeatureState(featureId, "isHovered", false);
}

</script>

<template>
  <div
    class="border rounded w-80 h-full relative bg-white p-2"
    :class="{
      'ring-2 ring-black': isHovered
    }"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div class="sticky top-0">
      <TRCButton class="absolute top-1 right-1 z-30 hover:bg-slate-200" @click="closeCard">
        <IconXMark class="text-slate-500" />
      </TRCButton>
      <h2 class="font-semibold bg-white px-2 pt-4 pb-2">
        {{ feature.region }} {{ feature.id }}
      </h2>
    </div>
    <pre>
{{ feature }}
    </pre>
  </div>
</template>