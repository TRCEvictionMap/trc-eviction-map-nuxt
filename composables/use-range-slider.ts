import type { WritableComputedRef } from "vue";

namespace RangeSlider {

  export type Range = WritableComputedRef<[start: number, end: number]>;
  
  export type Bounds = ComputedRef<{
    min: number;
    max: number;
  }>;
  
  export type Step = ComputedRef<number>;

  export type IsFocused = Ref<boolean>;

}

function getRangeSize(range: RangeSlider.Range) {
  return range.value[1] - range.value[0];
}

function getRangeCenter(range: RangeSlider.Range) {
  return range.value[1] - Math.floor(getRangeSize(range) / 2);
}

  /**
   * Returns a new range (`[number, number]`) if the `start` 
   * and `end` values fall within the range minimum and maximum 
   * values. Otherwise, returns `undefined`
   * @param center the proposed new range center
   * @returns 
   */
  function getValidRange(
    center: number,
    bounds: RangeSlider.Bounds,
    range: RangeSlider.Range
  ): [number, number] | undefined {
    const { min, max } = bounds.value;
    const half = Math.floor(getRangeSize(range) / 2);
    const start = center - half;
    const end = center + half;
    if (start >= min && end <= max) {
      return [start, end];
    }
  }


function useRangeSliderMouse(
  bounds: RangeSlider.Bounds,
  step: RangeSlider.Step,
  range: RangeSlider.Range,
  inputRef: Ref<HTMLInputElement | undefined>
) {
  const containerRef = ref<HTMLElement>();

  const isMousemove = ref(false);

  function getValue(ev: MouseEvent) {
    const container = assertUnref(containerRef);
    const { width: containerWidth, x: containerX } = container.getBoundingClientRect();
    const offsetX = ev.clientX - containerX;
    const ratio = Math.round(offsetX / containerWidth * 100) / 100;
    const value = Math.round(bounds.value.max * ratio);
    return Math.max(0, Math.min(value, bounds.value.max));
  }

  function onMousedown(ev: MouseEvent) {    
    ev.preventDefault();
  
    try {
      const input = assertUnref(inputRef);
      input.focus();

      const newRange = getValidRange(getValue(ev), bounds, range);

      if (newRange) {
        range.value = newRange;
      }

      window.addEventListener("mousemove", onMousemove);
      window.addEventListener("mouseup", onMouseup);
    } catch (error) {
      console.error(error);
    }
  }
  
  function onMousemove(ev: MouseEvent) {
    isMousemove.value = true;

    const newRange = getValidRange(getValue(ev), bounds, range);

    if (newRange) {
      range.value = newRange;
    }
  }
  
  function onMouseup(ev: MouseEvent) {
    isMousemove.value = false;

    const newRange = getValidRange(getValue(ev), bounds, range);

    if (newRange) {
      range.value = newRange;
    }

    window.removeEventListener("mousemove", onMousemove);
    window.removeEventListener("mouseup", onMouseup);
  }

  return { containerRef, isMousemove, containerListeners: { onMousedown } };
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
    try {
      const input = assertUnref(inputRef);
      const newRange = getValidRange(input.valueAsNumber, bounds, range);;

      if (newRange) {
        range.value = newRange;
      }

      input.value = getRangeCenter(range).toString();
    } catch (error) {
      console.warn("[useRangeSliderInput onInput]", error);
    }

  }

  return { inputRef, inputListeners: { onFocus, onBlur, onInput } };
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

  const { containerRef, containerListeners, isMousemove } = useRangeSliderMouse(
    bounds,
    step,
    range,
    inputRef,
  );

  watch(bounds, (bounds) => {
    if (inputRef.value) {
      inputRef.value.min = bounds.min.toString();
      inputRef.value.max = bounds.max.toString();
    }
  });

  return {
    inputRef,
    inputListeners,
    containerRef,
    containerListeners,
    isFocused,
    isMousemove,
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
