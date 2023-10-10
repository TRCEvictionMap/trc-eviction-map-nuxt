<script setup lang="ts">
import { useMapLayers } from "~/composables/use-map-layers";
import type { SourceId } from "utils/types";

const props = defineProps<{
    source: SourceId
}>();

const map = await useMap();

useMapLayers(map);

</script>

<template></template>composables/use-map-layers