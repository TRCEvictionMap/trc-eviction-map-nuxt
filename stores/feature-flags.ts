import { defineStore } from "pinia";

const useFeatureFlags = defineStore("feature-flags", () => {

  return {
    disableDataTable: false,
  };
});

export { useFeatureFlags };
