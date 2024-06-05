<script setup lang="ts">
import { useMapLayers } from "~/composables/use-map-layers";
import { useMapLayersV2 } from "~/composables/use-map-layers-v2";

const map = await useMap();

// useMapLayers(map);

useMapLayersV2(map)

</script>

<template></template>