<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureState } from "~/stores/feature-state-store";

const flags = useFeatureFlags();
const featureState = useFeatureState();
</script>

<template>
  <div class="space-y-4">
    <MapControlsV2 position="left" />
    <TransitionGroup name="features">
      <FeatureDetailV2
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
    </TransitionGroup>
    <div>
      <!-- Must be wrapped by div if placed below TransitionGroup (...because
           of v-if...?) -->
      <FeatureDetailChart v-if="!flags.disableChart" class="w-full" />
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