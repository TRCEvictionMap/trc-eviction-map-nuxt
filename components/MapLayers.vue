<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const mapControls = useMapControls();
</script>

<template>
    <template v-for="source in mapControls.sourceOptions">
        <MapLayer v-if="source.value === mapControls.currentSource" :source="source.value" />
    </template>
</template>