<script setup lang="ts">
const props = defineProps<{
  direction: "vertical" | "horizontal";
  modelValue: number;
  max?: number;
  min?: number;
}>();

const emit = defineEmits<{ "update:modelValue": [value: number] }>();


</script>

<template>
  
</template>