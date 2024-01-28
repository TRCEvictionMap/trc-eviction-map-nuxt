<script setup lang="ts">
import type { CSSProperties } from 'nuxt/dist/app/compat/capi';

defineProps<{ id: string; text: string }>();

const position = ref<{ x: number; y: number} | null>(null);

const textStyle = computed((): CSSProperties => ({
  top: `${position.value?.y}px`,
  left: `${position.value?.x}px`,
  position: "fixed",
  zIndex: 10,
}));

const activatorRef = ref<HTMLElement>();

function setPosition(ev: MouseEvent | FocusEvent) {
  const bounds = (ev.currentTarget as HTMLElement).getBoundingClientRect();
  position.value = {
    x: bounds.x,
    y: bounds.y + bounds.height,
  };
}

function clearPosition(_ev: MouseEvent | FocusEvent) {
  position.value = null;
}

onMounted(() => {
  if (activatorRef.value) {
    const activator = activatorRef.value;

    activator.tabIndex = 0;

    activator.addEventListener("mouseover", setPosition);
    activator.addEventListener("mouseout", clearPosition);
    activator.addEventListener("focus", setPosition);
    activator.addEventListener("blur", clearPosition)

    return () => {
      activator.removeEventListener("mouseover", setPosition);
      activator.removeEventListener("mouseout", clearPosition);
      activator.removeEventListener("focus", setPosition);
      activator.removeEventListener("blur", clearPosition)
    }
  }
});

</script>

<template>
  <div>
    <slot v-bind="{ ref: (el: any) => { activatorRef = el } }"></slot>
    <Teleport to="body">
      <div
        v-if="position"
        role="tooltip"
        :style="textStyle"
        class="p-1 bg-zinc-800 text-white text-sm rounded sticky"
      >
        {{ text }}
      </div>
    </Teleport>
  </div>
</template>