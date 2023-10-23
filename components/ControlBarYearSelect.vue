<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

defineProps<{ label?: string }>();

const controls = useMapControls();

const options = [
    { value: "2023" },
    { value: "2022" },
    { value: "2021" },
];
</script>

<template>
    <TRCSelect :label="label" :options="options" v-model="controls.currentYear" />
</template>