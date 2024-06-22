<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureState } from "~/stores/feature-state-store";

const flags = useFeatureFlags();
const featureState = useFeatureState();
</script>

<template>
  Left panel content
  <div class="space-y-4">
    <FeatureDetailChart v-if="!flags.disableChart" class="w-full" />
    <TransitionGroup name="features">
      <FeatureDetailV2 v-for="featureId in featureState.selectedFeatures" :key="featureId" :featureId="featureId" />
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