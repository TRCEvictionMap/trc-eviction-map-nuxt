<script setup lang="ts">

defineProps<{
  min: number;
  max: number;
  step: number;
}>()

const model = defineModel<number>();
</script>

<template>
  <input type="range" v-model.number="model" :min="min" :max="max" :step="step" >
</template>