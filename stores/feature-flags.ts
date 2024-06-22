import { defineStore } from "pinia";

const useFeatureFlags = defineStore("feature-flags", () => {
  const config = useRuntimeConfig();

  return {
    disableDataTableHeaderToggle: config.public.disableDataTableHeaderToggle,
    disableMultiColorFeatureOutline: config.public.disableMultiColorFeatureOutline,
    disableChart: config.public.disableChart,
  };
});

export { useFeatureFlags };
