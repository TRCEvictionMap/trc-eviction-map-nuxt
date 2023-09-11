<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const mapControls = useMapControls();
</script>

<template>
    <template v-for="source in mapControls.sourceOptions">
        <MapLayer v-if="source === mapControls.currentSource" :source="source" />
    </template>
</template>