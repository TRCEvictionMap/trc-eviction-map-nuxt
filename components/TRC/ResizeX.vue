<script setup lang="ts">

const posStart = ref(-1);

const emit = defineEmits<{
  "moveX": [delta: number];
}>();

function onMousemove(ev: MouseEvent) {
  console.log("hello")
  emit("moveX", ev.offsetX - posStart.value);
}

function onMouseup(ev: MouseEvent) {
  posStart.value = -1;
  window.removeEventListener("mousemove", onMousemove);
}

function onMousedown(ev: MouseEvent) {
  posStart.value = ev.offsetX;

  window.addEventListener("mousemove", onMousemove);
}
</script>

<template>
  <div
    @mousedown="onMousedown"
    @mouseup="onMouseup"
    class="absolute top-0 bottom-0 right-0 w-1 hover:cursor-ew-resize hover:ring hover:ring-inset hover:ring-black"
  ></div>
</template>