<script setup lang="ts">
import type { Register, Unregister } from "./use-triggers";

defineProps<{ menuName: string }>();

const itemRef = ref<HTMLElement>();

const registerTrigger = inject("registerTrigger") as Register;
const unregisterTrigger = inject("unregisterTrigger") as Unregister;

onMounted(() => { registerTrigger(itemRef.value!) });
onUnmounted(() => { unregisterTrigger(itemRef.value!) });

</script>

<template>
  <div ref="itemRef" :data-menu-name="menuName">
    <slot></slot>
  </div>
</template>