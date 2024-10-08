<script setup lang="ts">
import type { CSSProperties } from "vue";
import { interpolateFillRGBA } from "~/composables/use-interpolated-color-values";
import { useInterpolatedColors, BLUE } from "~/stores/interpolated-color-values-store";
import { useMapControlsV2, type ChoroplethMetric } from "~/stores/map-controls-store-v2";

defineProps<{
  position: Position;
}>();

const interpolated = useInterpolatedColors();
const controls = useMapControlsV2();

// const choroplethMetricName = computed(() =>
//   controls.choroplethMetricOptions.find(
//     ({ value }) => value === controls.currentChoroplethMetric
//   )?.text
// );

const CHOROPLETH_PERCENT_METRICS: ChoroplethMetric[] = ["poverty_rate", "renter_rate"];

const isChoroplethMetricPercent = computed(
  () => CHOROPLETH_PERCENT_METRICS.includes(controls.currentChoroplethMetric) || controls.currentChoroplethMetric.startsWith("pct")
)

const colorStops = computed(() => {
  const { entries } = interpolated.choropleth[controls.currentChoroplethMetric];

  return [0.1, 0.5, 0.9].map(
    (stop) => entries[Math.round(stop * (entries.length - 1))]
  );
});

const valueStops = computed(() => {
  if (isChoroplethMetricPercent.value) {
    return ["10%", "50%", "90%"];
  }
  return colorStops.value.map(
    ([value, _]) => `${value}${isChoroplethMetricPercent.value ? "%" : ""}`
  )
});

const gradientStyle = computed((): CSSProperties => ({
  background: `linear-gradient(
    to right,
    ${colorStops.value.map(([_, hex]) => `${hex}88`).join(", ")}
  )`,
}))

</script>

<template>
  <div
    v-if="controls.currentChoroplethMetric !== 'none'"
    class="
      absolute self-end shadow-xl border rounded bg-white text-xs p-2
      sm:p-3 sm:text-sm sm:min-h-[96px]
    "
    :class="{
      'bottom-8 right-2 sm:bottom-6': position === 'bottom-right',
      'top-2 left-2': position === 'top-left',
      'top-2 right-2': position === 'top-right',
      'bottom-9 left-2 sm:bottom-8': position === 'bottom-left',
    }"
  >
    <div class="flex space-x-4">
      <div class="space-y-2 min-w-[160px]">
        <h2 class="font-semibold ">
          {{ controls.choroplethMetricHumanReadable }}
        </h2>
        <div>
          <div
            class="h-6 w-full"
            :style="gradientStyle"
          ></div>
          <div class="relative h-8 -bottom-1">
            <div class="absolute left-[10%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ valueStops[0] }}
              </div>
            </div>
            <div class="absolute left-[50%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ valueStops[1] }}
              </div>
            </div>
            <div class="absolute left-[90%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ valueStops[2] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>