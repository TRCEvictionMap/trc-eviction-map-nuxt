<script setup lang="ts">
import type { DataSource } from "utils/types";

const props = defineProps<{
    source: DataSource
}>();

const map = await useMap();

useSource(map, props.source);

</script>

<template></template>