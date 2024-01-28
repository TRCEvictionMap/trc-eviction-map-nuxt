<script setup lang="ts">
import { useFloating, autoUpdate, autoPlacement } from "@floating-ui/vue";
import type { CSSProperties } from "nuxt/dist/app/compat/capi";

defineProps<{ text: string }>();

const isShowing = ref(false);

const reference = ref(null);
const floating = ref(null);

const { x, y, strategy } = useFloating(
  reference,
  floating,
  {
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement()
    ],
  },
);

const floatingStyle = computed((): CSSProperties => ({
  position: strategy.value,
  top: `${y}px`,
  left: `${x}px`,
}));

function show() {
  isShowing.value = true;
}

function hide() {
  isShowing.value = false;
}

function hideOnEsc(ev: KeyboardEvent) {
  if (ev.key === "Escape") {
    hide();
  }
}

onMounted(() => {
  if (reference.value) {

    const activator = reference.value as HTMLElement;
    
    activator.tabIndex = 0;

    window.addEventListener("keydown", hideOnEsc);

    activator.addEventListener("mouseover", show);
    activator.addEventListener("mouseout", hide);
    activator.addEventListener("focus", show);
    activator.addEventListener("blur", hide)
    
    return () => {
      window.removeEventListener("keydown", hideOnEsc);

      activator.removeEventListener("mouseover", show);
      activator.removeEventListener("mouseout", hide);
      activator.removeEventListener("focus", show);
      activator.removeEventListener("blur", hide)
    }
  }
})
</script>

<template>
  <div>
    <slot v-bind="{ ref: (el: any) => reference = el }"></slot>
    <!-- <Teleport to="body"> -->
      <p
        v-if="isShowing"
        ref="floating"
        class="absolute p-1 bg-slate-800 text-white rounded"
        :style="floatingStyle"
      >
        {{ text }}
      </p>
  <!-- </Teleport> -->
  </div>
</template>