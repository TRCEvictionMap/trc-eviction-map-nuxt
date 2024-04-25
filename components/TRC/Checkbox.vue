<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
defineEmits<{ "update:modelValue": [checked: boolean ]}>();
</script>

<template>
  <button role="checkbox" :aria-checked="modelValue" @click="$emit('update:modelValue', !modelValue)">
    <IconCheckSquareFill v-if="modelValue" class="text-trc-blue-500" />
    <IconSquare v-else />
  </button>
</template>