<script setup lang="ts" generic="Direction extends 'vertical' | 'horizontal'">
const props = defineProps<{
  direction: Direction;
  position: Direction extends 'vertical' ? "top" | "bottom" : "left" | "right";
  modelValue: number;
  max: number;
  min: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
  "mousedown": [];
  "mouseup": [];
}>();

const tracked = ref(-1);

function onMousemove(ev: MouseEvent) {
  // console.log("[Resize] onMousemove");
  const { modelValue, min, max, direction } = props;

  const mousePosition = direction === "horizontal" ? ev.clientX : ev.clientY;

  if (modelValue > max) {
    emit("update:modelValue", max);
  }

  if (modelValue < min) {
    emit("update:modelValue", min);
  }

  const delta = mousePosition - tracked.value;
  tracked.value = mousePosition;

  const updated = direction === "horizontal" ? modelValue + delta : modelValue - delta;

  if (updated >= min && updated <= max) {
    emit("update:modelValue", updated);
  }
}

function onMouseup() {
  // console.log("[Resize] onMouseup");
  emit("mouseup");
  tracked.value = -1;
  window.removeEventListener("selectstart", onSelectStart);
  window.removeEventListener("mousemove", onMousemove);
  window.removeEventListener("mouseup", onMouseup);
}

function onMousedown(ev: MouseEvent) {
  // console.log("[Resize] onMousedown");
  emit("mousedown");
  tracked.value = props.direction === "horizontal" ? ev.clientX : ev.clientY;
  window.addEventListener("selectstart", onSelectStart);
  window.addEventListener("mousemove", onMousemove);
  window.addEventListener("mouseup", onMouseup);
}

function onSelectStart(ev: Event) {
  // console.log("[Resize] onSelectStart");
  ev.preventDefault();
}

</script>

<template>
  <div
    @mousedown="onMousedown"
    role="button"
    class="absolute transition hover:bg-trc-blue-400 z-40"
    :class="{
      'top-0 bottom-0 w-2 cursor-ew-resize': direction === 'horizontal',
      'left-0 right-0 h-2 cursor-ns-resize': direction === 'vertical',
      'right-0': position === 'right',
      'left-0': position === 'left',
      'top-0': position === 'top',
      'bottom-0': position === 'bottom',
      'bg-trc-blue-400': tracked > -1
    }"
  ></div>
</template>