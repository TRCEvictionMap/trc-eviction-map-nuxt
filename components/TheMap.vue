<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

const map = useSetupMap("the-map");

provide("map", map);

</script>

<template>
    <div class="h-[calc(100%-60px)] flex-1 flex">
        <slot name="right"></slot>
        <div class="relative flex flex-col flex-1">
            <div id="the-map" class="flex-1"></div>
            <slot></slot>
        </div>
    </div>
</template>
