<script setup lang="ts">
import type { SourceId } from "utils/types";

const props = defineProps<{
    source: SourceId
}>();

const map = await useMap();

useSource(map, props.source);

</script>

<template></template>