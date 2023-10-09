<script setup lang="ts">
import { SourceId } from "utils/types";
import { useMapControls } from "~/stores/map-controls-store";

const mapControls = useMapControls();

const options: { value: SourceId, text?: string }[] = [
    {
        value: "block-group",
        text: "Census Block Group",
    },
];
</script>

<template>
    <TRCSelect :options="options" v-model="mapControls.currentSource" />
</template>
