<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureState } from "~/stores/feature-state-store";

const flags = useFeatureFlags();
const featureState = useFeatureState();
</script>

<template>
  <div class="space-y-6">
    <MapControlsV2 position="left" />
      <TransitionGroup name="features" as="div" class="flex space-y-4">
        <FeatureDetailV2
          v-for="featureId in featureState.selectedFeatures"
          :key="featureId"
          :featureId="featureId"
        />
        <FeatureDetailChart
          v-if="!flags.disableChart && featureState.selectedFeatures.length > 0"
          class="w-full"
        />
      </TransitionGroup>
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