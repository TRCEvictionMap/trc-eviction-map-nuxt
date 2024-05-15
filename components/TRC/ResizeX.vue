<script setup lang="ts">

const emit = defineEmits<{ "moveX": [delta: number] }>();

const currentX = ref(-1);

function onMousemove(ev: MouseEvent) {
    const delta = ev.clientX - currentX.value;
    currentX.value = ev.clientX;
    emit("moveX", delta);
}

function onMouseup(ev: MouseEvent) {
  currentX.value = -1;
  window.removeEventListener("selectstart", disableTextSelect);
  window.removeEventListener("mousemove", onMousemove);
}

function onMousedown(ev: MouseEvent) {
  currentX.value = ev.clientX;
  window.addEventListener("selectstart", disableTextSelect);
  window.addEventListener("mousemove", onMousemove);
}

function disableTextSelect(ev: Event) {
  ev.preventDefault();
}

onMounted(() => {
  window.addEventListener("mouseup", onMouseup);
});

onBeforeUnmount(() => {
  window.removeEventListener("mouseup", onMouseup);
});

</script>

<template>
  <div @mousedown="onMousedown" class="absolute top-0 bottom-0 right-0 w-1 hover:cursor-ew-resize transition hover:bg-trc-blue-400"></div>
</template>