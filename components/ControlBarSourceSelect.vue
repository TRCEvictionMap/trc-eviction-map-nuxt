<script setup lang="ts">
import { SourceId } from "utils/types";
import { useMapControls } from "~/stores/map-controls-store";

defineProps<{ label?: string }>();

const mapControls = useMapControls();

const options: { value: SourceId, text?: string }[] = [
    {
        value: "block-group",
        text: "Census Block Group",
    },
    {
        value: "alder-district",
        text: "Aldermanic Districts"
    }
];
</script>

<template>
    <TRCSelect :label="label" :options="options" v-model="mapControls.currentSource" />
</template>
