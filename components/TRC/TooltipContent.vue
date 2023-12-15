<script setup lang="ts">
import type { CSSProperties } from 'nuxt/dist/app/compat/capi';

const isOpen = inject<Ref<boolean>>("isOpen");
const registerTooltipContent = inject<(contentDiv: HTMLDivElement) => void>("registerTooltipContent");
const tooltipTrigger = inject<Ref<HTMLDivElement>>("tooltipTrigger");

const contentDiv = ref<HTMLDivElement>();

const style = computed((): CSSProperties | undefined => {
  if (tooltipTrigger && contentDiv.value) {
    const triggerRect = tooltipTrigger.value.getBoundingClientRect();
    const contentRect = contentDiv.value.getBoundingClientRect();
    // const viewportRect = document.body.getBoundingClientRect();

    let top = contentRect.top - 8;
    let left = contentRect.left - 8;

    if (contentRect.height + 8 > triggerRect.top) {
      // content should appear below trigger
      top = triggerRect.height + 8;
    }

    return {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
    };
  }
});

onMounted(() => {
  if (registerTooltipContent && contentDiv.value) {
    registerTooltipContent(contentDiv.value);
  }
});
</script>

<template>
  <div v-if="isOpen" :style="style">
    <slot></slot>
  </div>
</template>