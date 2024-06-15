<script setup lang="ts">
import type { CSSProperties } from "vue";

interface RangeSliderProps {
  modelValue: [number, number];
  min: number;
  max: number;
  step?: number;
}

const props = withDefaults(defineProps<RangeSliderProps>(), {
  step: 1,
});

const emit = defineEmits<{
  "update:modelValue": [value: [number, number]];
}>();

const bounds: RangeSlider.Bounds = computed(() => ({
  min: props.min,
  max: props.max,
}));

const step: RangeSlider.Step = computed(() => props.step);

const range: RangeSlider.Range = computed({
  get() {
    return {
      start: props.modelValue[0],
      end: props.modelValue[1],
    }
  },
  set(value) {
    emit("update:modelValue", [value.start, value.end]);
  },
});

const {
  inputRef,
  inputListeners,
  containerRef,
  containerListeners,
  isFocused,
  rangeCenter,
  rangeSize,
} = useRangeSlider({ bounds, step, range });

const trackStyle = computed((): CSSProperties => ({
  left: `${Math.floor(props.modelValue[0] / props.max * 100)}%`,
  right: `${Math.ceil(props.modelValue[1] / props.max * 100)}%`,
  width: `${Math.ceil(rangeSize.value / props.max * 100)}%`
}));

const thumbStyle = computed((): CSSProperties => ({
  left: `calc(${Math.floor(rangeCenter.value / props.max * 100)}% - 8px)`
}));

</script>

<template>
  <div
    ref="containerRef"
    class="relative w-72 cursor-pointer"
    v-bind="containerListeners"
  >
    <!-- @mousedown="(ev) => onMousedown(ev, rangeCenter)" -->
    <!-- extends the full length of the slider -->
    <span class="absolute top-2 w-full h-1 bg-slate-300 rounded"></span>
    <!-- represents the current range -->
    <span class="absolute top-2 h-1 bg-trc-blue-500 rounded " :style="trackStyle"></span>
    <!-- the button the user clicks and slides -->
    <span
      class="absolute top-0 h-5 w-5 rounded-full bg-trc-blue-500 shadow"
      :class="{
        'ring ring-trc-blue-400 ring-offset-1': isFocused,
      }"
      :style="thumbStyle"
    >
      <input
        ref="inputRef"
        type="range"
        :value="rangeCenter"
        v-bind="inputListeners"
        :min="min"
        :max="max"
        :step="step"
        style="clip-path: rect(0 0 0 0);"
      >
    </span>
  </div>

</template>
