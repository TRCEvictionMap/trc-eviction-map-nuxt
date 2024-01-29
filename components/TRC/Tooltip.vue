<script setup lang="ts">
import { useFloating, autoUpdate, autoPlacement, arrow, offset } from "@floating-ui/vue";
import type { CSSProperties } from "nuxt/dist/app/compat/capi";

const props = defineProps<{ text: string, delay?: number }>();

const isShowing = ref(false);

const reference = ref(null);
const floating = ref(null);
const floatingArrow = ref(null);

const { floatingStyles, middlewareData } = useFloating(
  reference,
  floating,
  {
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement(),
      offset(8),
      arrow({
        element: floatingArrow
      })
    ],
  },
);

const floatingArrowStyles = computed((): CSSProperties => {
  const arrow = middlewareData.value.arrow;
  const placement = middlewareData.value.offset?.placement

  const marginAndBorder = ((): CSSProperties => {
    console.log(placement)
    if (placement?.startsWith("bottom")) {
      return {
        borderStyle: "solid",
        borderWidth: "5px",
        marginLeft: "-5px",
        borderColor: "transparent transparent black transparent",
      };
    }

    if (placement?.startsWith("top")) {
      return {
        borderStyle: "solid",
        borderWidth: "5px",
        marginLeft: "-5px",
        borderColor: "black transparent transparent transparent",
        transform: "rotate(180deg)"
      };
    }

    if (placement?.startsWith("left")) {
      // rv.transform
    }

    return {};
  })();

  return {
    position: "absolute",
    left: arrow && typeof arrow.x === "number" ? `${arrow.x}px` : "",
    top: arrow && typeof arrow.y === "number" ? `${arrow.y}px` : "",
    // ...marginAndBorder
  };
})

let handle: any;

function show() {
  handle = setTimeout(() => {
    isShowing.value = true;
  }, props.delay ?? 250);
}

function hide() {
  clearTimeout(handle);
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
    <Teleport to="body">
      <div
        v-if="isShowing"
        ref="floating"
        class="absolute py-1 px-2 rounded bg-slate-800 text-white text-sm max-w-xs"
        :style="floatingStyles"
      >
        {{ text }}
        <!-- <div
          ref="floatingArrow"
          :style="floatingArrowStyles"
        ></div> -->
    </div>
    </Teleport>
  </div>
</template>