import { defineStore } from "pinia";

const useFeatureFlags = defineStore("feature-flags", () => {

  return {
    disableDataTableHeaderToggle: false,
  };
});

export { useFeatureFlags };