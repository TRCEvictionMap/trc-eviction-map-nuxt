import { defineStore } from "pinia";

const SCREEN_SIZE = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1536,
};

type ScreenSize = keyof typeof SCREEN_SIZE | "xs";

function getScreenSize(): ScreenSize {
  if (window.innerWidth < SCREEN_SIZE.sm) return "xs";
  if (window.innerWidth < SCREEN_SIZE.md) return "sm";
  if (window.innerWidth < SCREEN_SIZE.lg) return "md";
  if (window.innerWidth < SCREEN_SIZE["2xl"]) return "lg";
  return "2xl";
}

const useScreenSize = defineStore("breakpoint", () => {

  const screenSize: Ref<keyof typeof SCREEN_SIZE | "xs"> = ref("xs");

  function onWindowResize() {
    screenSize.value = getScreenSize();
  }

  return { onWindowResize, screenSize };
});

export { useScreenSize };
