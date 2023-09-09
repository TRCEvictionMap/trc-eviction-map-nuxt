<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const mapControls = useMapControls();

const options = computed(() =>
    mapControls.sourceOptions.map((sourceId) => ({
        key: sourceId,
        value: sourceId,
        text: sourceId.split("-").map((x) => x[0].toUpperCase() + x.slice(1)).join(" "),
    }))
);
</script>

<template>
    <TRCSelect label="Source" :options="options" v-model="mapControls.currentSource" />
</template>
