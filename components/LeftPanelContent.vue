<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const controls = useMapControlsV2();
const flags = useFeatureFlags();
const featureState = useFeatureState();
</script>

<template>
  <div class="space-y-6 w-full h-full">
    <MapControlsV2 position="left" />
    <TransitionGroup name="features">
      <FeatureDetailV2
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
      <div key="placeholders" v-if="featureState.selectedFeatures.length > 0" class="space-y-6">
        <div
          v-for="_ in 3 - featureState.selectedFeatures.length"
          class="bg-slate-100 p-4 rounded border"
        >
          <p>Select another {{ controls.currentSourceHumanReadable }}</p>
        </div>
      </div>
      <FeatureDetailChart
        v-if="!flags.disableChart && featureState.selectedFeatures.length > 0"
        class="w-full"
      />
    </TransitionGroup>
    <div class="flex justify-center items-center pt-12">
      <p v-if="featureState.selectedFeatures.length === 0" class="">
        Click a {{ controls.currentSourceHumanReadable }} on the map
      </p>
    </div>
  </div>
</template>

<style>
.features-move,
.features-enter-active,
.features-leave-active {
  transition: all 150ms ease-in-out;
}

.features-enter-from,
.features-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.features-leave-active {
  position: absolute;
}
</style>