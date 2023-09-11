<script setup lang="ts">
import { SourceId } from "utils/types";
import { useMapControls } from "~/stores/map-controls-store";

const mapControls = useMapControls();

const options: { value: SourceId, text?: string }[] = [
    {
        value: "alder-districts",
        text: "Alder Districts"
    },
    {
        value: "block-groups",
        text: "Block Groups",
    },
    {
        value: "zip-codes",
        text: "ZIP Codes"
    },
];
</script>

<template>
    <TRCSelect label="Source" :options="options" v-model="mapControls.currentSource" />
</template>
