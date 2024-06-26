<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

const map = useSetupMap({ containerId: "map-container" });

provide("map", map);

</script>

<template>
  <div class="h-[calc(100%-60px)] flex-1 flex relative">
    <div class="flex z-20">
      <slot name="right"></slot>
    </div>
    <div class="relative flex flex-col flex-1">
      <div
        id="map-container"
        class="flex-1"
      ></div>
      <slot></slot>
    </div>
  </div>
</template>
