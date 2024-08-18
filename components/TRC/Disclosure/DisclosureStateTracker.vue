<script setup lang="ts">

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ "update:isOpen": [boolean] }>();

watch(
  () => props.isOpen,
  (isOpen) => { emit("update:isOpen", isOpen) },
  { immediate: true }
);

</script>

<template></template>