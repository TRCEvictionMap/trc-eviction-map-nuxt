<script setup lang="ts">

const contentRef = ref<HTMLDivElement>();

defineExpose({ contentRef });

</script>

<template>
  <div ref="contentRef">
    <slot></slot>
  </div>
</template>