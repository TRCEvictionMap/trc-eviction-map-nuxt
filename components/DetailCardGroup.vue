<script setup lang="ts">
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();
</script>

<template>
    <div class="absolute top-0 flex items-center min-h-screen">
        <TransitionGroup class="absolute flex space-x-2" tag="div" name="fade">
            <DetailCard v-for="featureId in selectedFeatures.items" :key="featureId" :featureId="featureId" />
        </TransitionGroup>
    </div>
</template>

<style>
/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>