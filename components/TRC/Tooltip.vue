<script setup lang="ts">
import { useFloating, autoUpdate, autoPlacement, arrow, offset, type Placement, type Middleware } from "@floating-ui/vue";
import type { CSSProperties } from "vue";

const props = defineProps<{
  text: string,
  delay?: number,
  /** Used as `placement` option to `useFloating` if not undefined. Otherwise, `useFloating` uses `autoPlacement` middleware */
  placement?: Placement,
}>();

const isShowing = ref(false);

const reference = ref(null);
const floating = ref(null);
const floatingArrow = ref(null);

const { floatingStyles, middlewareData } = useFloating(
  reference,
  floating,
  {
    whileElementsMounted: autoUpdate,
    placement: props.placement,
    middleware: [
      !props.placement && autoPlacement(),
      offset(8),
      arrow({
        element: floatingArrow
      })
    ].filter(Boolean) as any,
  },
);

// const floatingArrowStyles = computed((): CSSProperties => {
//   const arrow = middlewareData.value.arrow;
//   const placement = middlewareData.value.offset?.placement

//   const marginAndBorder = ((): CSSProperties => {
//     if (placement?.startsWith("bottom")) {
//       return {
//         borderStyle: "solid",
//         borderWidth: "5px",
//         marginLeft: "-5px",
//         borderColor: "transparent transparent black transparent",
//       };
//     }

//     if (placement?.startsWith("top")) {
//       return {
//         borderStyle: "solid",
//         borderWidth: "5px",
//         marginLeft: "-5px",
//         borderColor: "black transparent transparent transparent",
//         transform: "rotate(180deg)"
//       };
//     }

//     if (placement?.startsWith("left")) {
//       // rv.transform
//     }

//     return {};
//   })();

//   return {
//     position: "absolute",
//     left: arrow && typeof arrow.x === "number" ? `${arrow.x}px` : "",
//     top: arrow && typeof arrow.y === "number" ? `${arrow.y}px` : "",
//     // ...marginAndBorder
//   };
// })

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
  <span role="tooltip">
    <slot v-bind="{
      ref: (el: any) => reference = el,
      class: 'underline decoration-dotted decoration-2'
    }"></slot>

    <Teleport to="body">
      <div
        v-if="isShowing"
        ref="floating"
        class="absolute z-50 py-1 px-2 rounded bg-slate-800 text-white text-sm max-w-xs"
        :style="floatingStyles"
      >
        {{ text }}
      </div>
    </Teleport>
  </span>
</template>