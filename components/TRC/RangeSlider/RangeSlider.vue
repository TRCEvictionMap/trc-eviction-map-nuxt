<script setup lang="ts">
import type { CSSProperties } from "vue";

interface RangeSliderProps {
  modelValue: [number, number];
  min: number;
  max: number;
  /** @todo @notimplemented */
  showTicks?: boolean;
  /** @todo @notimplemented */
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
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const {
  inputRef,
  inputListeners,
  containerRef,
  containerListeners,
  isFocused,
  isMousemove,
  rangeCenter,
  rangeSize,
} = useRangeSlider({ bounds, step, range });

const trackStyle = computed((): CSSProperties => ({
  left: `${Math.floor(props.modelValue[0] / props.max * 100)}%`,
  width: `${Math.ceil(rangeSize.value / props.max * 100)}%`
}));

const thumbStyle = computed((): CSSProperties => ({
  left: `${Math.floor(rangeCenter.value / props.max * 100)}%`,
}));

const tickStyle = computed((): CSSProperties => ({
  width: `${Math.floor(1 / props.max * 100)}%`,
}));

</script>

<template>
  <div
    ref="containerRef"
    class="relative h-5 cursor-pointer"
    v-bind="containerListeners"
  >
    <span class="absolute top-2 w-full h-1 flex bg-slate-300 rounded">
      <template v-if="showTicks && max > 0">
        <span
          v-for="n in max"
          :style="tickStyle"
        >
          <slot>|</slot>
        </span>
      </template>
    </span>
    <span
      class="absolute top-2 h-1 bg-trc-blue-500 rounded w-full"
      :class="{
        'transition-all': !isMousemove
      }"
      :style="trackStyle"
    ></span>
    <span
      class="absolute top-0 h-5 w-5 rounded-full bg-trc-blue-500 -translate-x-2"
      :class="{
        'ring ring-trc-blue-400 ring-offset-2': isFocused,
        'transition-all': !isMousemove
      }"
      :style="thumbStyle"
    >
      <input
        ref="inputRef"
        type="range"
        :value="rangeCenter"
        :aria-valuenow="rangeCenter"
        v-bind="inputListeners"
        :min="min"
        :max="max"
        :step="step"
        style="clip-path: rect(0 0 0 0);"
      >
    </span>
  </div>
</template>
