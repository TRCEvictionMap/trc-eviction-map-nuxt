<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const controls = useMapControls();

const options = [
    { value: "2023" },
    { value: "2022" },
    { value: "2021" },
];
</script>

<template>
    <TRCSelect :options="options" v-model="controls.currentYear" />
</template>