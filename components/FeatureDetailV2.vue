<script setup lang="ts">
import { useFeatureProperties, type FeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";

const { featureId } = defineProps<{ featureId: string }>();

const controls = useMapControls();
const featureState = useFeatureState();
const featureProperties = useFeatureProperties();

const isHovered = computed(() => featureState.hoveredFeature === featureId);

const data = computed(() => {
  const { evictions, id, ...properties } = featureProperties.getFeatureProperties(
    controls.currentSource,
    featureId
  ) as FeatureProperties;

  return {
    ...properties,
    evictions,
    id: id.replace(/\w_/, ""),
  };
});

function deselectFeature() {
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
    class="border rounded bg-white relative p-4"
    :class="{
      'ring-2 ring-black': isHovered,
    }"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div>
      <TRCButton class="absolute top-2 right-2 hover:bg-slate-300/40" @click="deselectFeature">
        <IconXMark class="text-slate-500" />
      </TRCButton>
    </div>
    {{ data }}
  </div>
</template>