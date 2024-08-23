<script setup lang="ts">
import type { Register, Unregister } from "./use-triggers";

const props = defineProps<{ menuName: string }>();

const triggerRef = ref<HTMLElement>();

const registerTrigger = inject("registerTrigger") as Register;
const unregisterTrigger = inject("unregisterTrigger") as Unregister;

const activeMenu = inject("activeMenu") as Ref<string>;

const isActive = computed(() => activeMenu.value === props.menuName);

onMounted(() => { registerTrigger(triggerRef.value!) });
onUnmounted(() => { unregisterTrigger(triggerRef.value!) });

defineExpose({ triggerRef });

</script>

<template>
  <button
    ref="triggerRef"
    tabindex="-1"
    :data-menu-name="menuName"
    class=""
    :class="{
      'text-trc-blue-500': isActive
    }"
  >
    <slot></slot>
  </button>
</template>