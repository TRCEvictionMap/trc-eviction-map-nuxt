import type { WritableComputedRef } from "vue";

namespace RangeSlider {
  export type Range = WritableComputedRef<{
    start: number;
    end: number;
  }>;
  
  export type Bounds = ComputedRef<{
    min: number;
    max: number;
  }>;
  
  export type Step = ComputedRef<number>;

  export type IsFocused = Ref<boolean>;
}


function getRangeSize(range: RangeSlider.Range) {
  return range.value.end - range.value.start;
}

function getRangeCenter(range: RangeSlider.Range) {
  return range.value.end - Math.floor(getRangeSize(range) / 2);
}


function useRangeSliderMouse(
  bounds: RangeSlider.Bounds,
  step: RangeSlider.Step,
  range: RangeSlider.Range
) {
  const containerRef = ref<HTMLElement>();

  function onMousedown(ev: MouseEvent) {

  }

  function _onMousemove(ev: MouseEvent) {
  
  }

  function _onMouseup(ev: MouseEvent) {

  }

  return { containerRef, onMousedown };
}


function useRangeSliderInput(
  bounds: RangeSlider.Bounds,
  range: RangeSlider.Range,
  isFocused: RangeSlider.IsFocused,
) {
  const inputRef = ref<HTMLInputElement>();

  function onFocus() {
    isFocused.value = true;
  }
  
  function onBlur() {
    isFocused.value = false;
  }

  function onInput() {
    if (inputRef.value) {
      try {
        const rangeSize = getRangeSize(range);
        const value = Number.parseFloat(inputRef.value.value);
        const start = value - Math.floor(rangeSize / 2);
        const end = value + Math.floor(rangeSize / 2);
        if (start >= bounds.value.min && end <= bounds.value.max) {
          range.value = { start, end };
        }
        inputRef.value.value = getRangeCenter(range).toString();
      } catch (error) {
        console.warn("[useRangeSliderInput onInput]", error);
      }
    }
  }

  return {
    inputRef,
    inputListeners: { onFocus, onBlur, onInput },
  };
}


interface UseRangeSliderOptions {
  bounds: RangeSlider.Bounds;
  step: RangeSlider.Step;
  range: RangeSlider.Range;
}


function useRangeSlider(options: UseRangeSliderOptions) {
  const { bounds, step, range } = options;

  const isFocused = ref(false);

  const rangeSize = computed(() => getRangeSize(range));
  const rangeCenter = computed(() => getRangeCenter(range));

  const { inputRef, inputListeners } = useRangeSliderInput(
    bounds,
    range,
    isFocused
  );

  const { containerRef, onMousedown } = useRangeSliderMouse(
    bounds,
    step,
    range
  );

  watch(bounds, (bounds) => {
    if (inputRef.value) {
      inputRef.value.min = bounds.min.toString();
      inputRef.value.max = bounds.max.toString();
    }
  });

  return {
    inputRef,
    containerRef,
    inputListeners,
    isFocused,
    onMousedown,
    rangeCenter,
    rangeSize
  };
}


export { useRangeSlider };
export type { RangeSlider };
















// interface UseSliderMouseInputParams {
//   min: number;
//   max: number;
//   step: number;
//   /** The current position  */
//   currentPosition: ComputedRef<number>;
//   /** if `true`, solve for `y` axis instead of `x` */
//   vertical?: boolean;
// }

// /**
//  * Listen for events and compute values necessary to emulate `<input type="range"`
//  * mouse behavior
//  * @param params 
//  * @returns 
//  */
// function useSliderMouseInput(params: UseSliderMouseInputParams) {
//   const { min, max, step, vertical, currentPosition } = params;

//   const start = ref({
//     clientX: -1,
//     clientY: -1,
//     offsetX: -1,
//     offsetY: -1,
//   });

//   const current = ref({ clientX: -1, clientY: -1 });

//   const delta = computed(() => ({
//     x: current.value.clientX - start.value.clientX,
//     y: current.value.clientY - start.value.clientY,
//   }));

//   const value = computed(() => {
//     if (vertical) {
      
//     } else {

//     }
//   });

//   function onMousedown(ev: MouseEvent, initalValue: number) {

//     current.value.clientX = ev.clientX;
//     current.value.clientY = ev.clientY;

//     start.value.clientX = ev.clientX;
//     start.value.clientY = ev.clientY;

//     start.value.offsetX = ev.offsetX;
//     start.value.offsetY = ev.offsetY;


//     window.addEventListener("mousemove", onMousemove);
//     window.addEventListener("mouseup", onMouseup);
//   }

//   function onMousemove(ev: MouseEvent) {
//     current.value.clientX = ev.clientX;
//     current.value.clientY = ev.clientY;
//   }

//   function onMouseup(ev: MouseEvent) {
//     current.value.clientX = -1;
//     current.value.clientY = -1;

//     start.value.clientX = -1;
//     start.value.clientY = -1;

//     start.value.offsetX = -1;
//     start.value.offsetY = -1;

//     window.removeEventListener("mousemove", onMousemove);
//     window.removeEventListener("mouseup", onMouseup);
//   }

//   return { onMousedown, delta };
// }

// export { useSliderMouseInput };
