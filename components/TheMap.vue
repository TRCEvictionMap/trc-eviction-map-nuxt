<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

const map = useSetupMap();

provide("map", map);

</script>

<template>
    <main class="flex flex-col min-h-screen">
        <slot name="control-bar"></slot>
        <div id="the-map" class="relative min-h-screen"></div>
        <slot></slot>
    </main>
</template>
