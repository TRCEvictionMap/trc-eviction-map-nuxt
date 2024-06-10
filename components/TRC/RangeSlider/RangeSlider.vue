<script setup lang="ts">
import type { CSSProperties } from "vue";

const props = defineProps<{
  min: number;
  max: number;
  modelValue: [number, number];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: [number, number]];
}>();

const input = ref<HTMLInputElement>();

const rangeSize = computed(() => props.modelValue[1] - props.modelValue[0]);
const rangeCenter = computed(() => props.modelValue[1] - Math.floor(rangeSize.value / 2));

watch(
  [
    () => props.min,
    () => props.max,
  ],
  ([min, max]) => {
    if (input.value) {
      input.value.min = min.toString();
      input.value.max = max.toString();
    }
  }
);

function onInput() {
  if (input.value) {
    try {
      const value = Number.parseFloat(input.value.value);
      const nextStart = value - Math.floor(rangeSize.value / 2);
      const nextEnd = value + Math.floor(rangeSize.value / 2);
      if (nextStart >= props.min && nextEnd <= props.max) {
        emit("update:modelValue", [nextStart, nextEnd]);
      }
      input.value.value = rangeCenter.value.toString();
    } catch (error) {
      console.warn("[RangeSlider onInput]", error);
    }
  }
}

const trackStyle = computed((): CSSProperties => {
  const style: CSSProperties = {
    position: "absolute",
    left: `${Math.round(props.modelValue[0] / props.max * 100)}%`,
    right: `${Math.round(props.modelValue[1] / props.max * 100)}%`,
    width: `${Math.round(rangeSize.value / props.max * 100)}%`
  };
  // console.log(style);
  return style;
});

function onTouchStart(ev: any) {
  console.log(ev)
}

</script>

<template>
  <div class="relative w-72" @touchstart="onTouchStart">
    <!-- extends the full length of the slider -->
    <span class="rail absolute top-2 w-full h-1 bg-slate-300 rounded"></span>
    <!-- represents the current range -->
    <span class="track top-2 h-1 bg-trc-blue-500 rounded" :style="trackStyle"></span>
    <!-- the button the user clicks and slides -->
    <span class="handle" >
      <input
        ref="input"
        type="range"
        :value="rangeCenter"
        @input="onInput"
        :min="min"
        :max="max"
        step="1"
        class="absolute"
        style=""
      >
    </span>

  </div>
</template>

<style scoped>
input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent; 
  border-color: transparent;
  color: transparent;
}

/* Special styling for WebKit/Blink */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #000000;
  height: 24px;
  width: 12px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 24px;
  width: 12px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}

/* All the same stuff for IE */
input[type=range]::-ms-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: 1px solid #000000;
  height: 24px;
  width: 12px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
</style>