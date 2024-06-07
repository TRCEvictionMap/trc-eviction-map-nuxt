<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";
import { interpolateFillRGBA } from "~/composables/use-interpolated-color-values";

defineProps<{
  position: Position
}>();

const interpolated = useInterpolatedColorValues();
const controls = useMapControls();

const demographicMetricName = computed(() =>
  controls.demographicMetricOptions.find(
    ({ value }) => value === controls.currentDemographicMetric
  )?.text
);

const evictionMetric = computed(() =>
  controls.evictionMetricOptions.find(
    ({ value }) => value === controls.currentEvictionMetric
  )?.text
);

const demographicStops = computed(() =>
  Object.keys(interpolated[controls.currentDemographicMetric])
);

const evictionStops = computed(() =>
  Object.keys(interpolated[controls.currentEvictionMetric])
);

const evictionStopSizes = computed(() =>
  evictionStops.value.map(
    (stop) => (interpolated[controls.currentEvictionMetric] as Record<string, number>)[stop] * 2
  )
);

</script>

<template>
  <div
    v-if="controls.currentDemographicMetric !== 'none'"
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
      <div
        v-if="controls.currentDemographicMetric !== 'none'"
        class="space-y-2 min-w-[160px]"
      >
        <h2 class="font-semibold ">
          {{ demographicMetricName }}
        </h2>
        <div>
          <div
            class="h-6 w-full"
            :style="{
              background: `linear-gradient(to right, ${interpolateFillRGBA(0.05)}, ${interpolateFillRGBA(0.8)})`
            }"
          ></div>
          <div class="relative h-8 -bottom-1">
            <div class="absolute left-[10%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ demographicStops[1] }}
              </div>
            </div>
            <div class="absolute left-[50%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ demographicStops[2] }}
              </div>
            </div>
            <div class="absolute left-[90%]">
              <div class="h-2 border-r border-slate-400 w-[1px]"></div>
              <div class="-translate-x-[50%]">
                {{ demographicStops[3] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>