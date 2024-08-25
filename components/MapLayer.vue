<script setup lang="ts">
import { useMapLayersV2 } from "~/composables/use-map-layers-v2";

const map = await useMap();

useMapLayersV2(map)

</script>

<template></template>