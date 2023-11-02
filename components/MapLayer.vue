<script setup lang="ts">
import { useMapLayers } from "~/composables/use-map-layers";

const map = await useMap();

useMapLayers(map);

</script>

<template></template>