<script setup lang="ts">
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();
</script>

<template>
    <div class="absolute top-0 flex items-center min-h-screen">
        <TransitionGroup name="items" class="absolute flex space-x-1" tag="div">
            <DetailCard v-for="featureId in selectedFeatures.items" :key="featureId" :featureId="featureId" />
        </TransitionGroup>
    </div>
</template>

<style>
/* 1. declare transition */
.items-move,
.items-enter-active,
.items-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.items-enter-from {
  opacity: 0;
  transform: translate(-30px, 0);
}

.items-leave-to {
    opacity: 0;
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.items-leave-active {
  position: absolute;
}
</style>