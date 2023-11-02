<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

const map = await useSetupMap();

provide("map", map);

</script>

<template>
    <div class="relative flex flex-col flex-1">
        <div id="the-map" class="flex-1"></div>
        <slot></slot>
    </div>
</template>
