import { defineStore } from "pinia";
import { useMapControls } from "./map-controls-store";
import { useFeaturePropertiesV2 } from "./feature-properties-store-v2";
import { useMapControlsV2 } from "./map-controls-store-v2";

const BLUE = [
  "#f7fbff",
  "#deebf7",
  "#c6dbef",
  "#9ecae1",
  "#6baed6",
  "#4292c6",
  "#2171b5",
  "#08519c",
  "#08306b"
];

const useInterpolatedColors = defineStore("interpolated-colors", () => {
  const controls = useMapControlsV2();
  const featureProperties = useFeaturePropertiesV2();


});

export { useInterpolatedColors };
