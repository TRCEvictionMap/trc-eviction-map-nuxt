<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const controls = useMapControls();
</script>

<template>
  <div class="border rounded w-[22rem] sm:w-[24rem] h-full relative bg-slate-300/50 flex justify-center py-10">
    <h3 class="font-bold text-slate-700">
      Select another {{ controls.currentSourceHumanReadable }}
    </h3>
  </div>
</template>