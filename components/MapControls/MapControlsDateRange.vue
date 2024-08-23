<script setup lang="ts">
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const controls = useMapControlsV2();

const range = computed(
  () => controls.currentMonthRangeHumanReadable
);

</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-8">
      <TRCSelect
        class="z-10"
        label="Date Range Size"
        :options="controls.timeIntervalOptions"
        v-model="controls.currentMonthRangeSize"
      />
      <TRCSwitch
        stackLabel
        :label="`${controls.showHeatmap ? 'Hide' : 'Show'} Heatmap`"
        v-model="controls.showHeatmap"
      />
    </div>
    <div class="flex flex-wrap gap-y-4 gap-x-6">
      <div class="space-y-2 flex-1">
        <div class="text-sm whitespace-nowrap">
          <template v-if="range">
            <template v-if="range.isSingle">
              {{ range.start.mAbbr }} {{ range.start.y }}
            </template>
            <template v-else>
              {{ range.start.mAbbr }} {{ range.start.y }} - {{ range.end.mAbbr }} {{ range.end.y }}
            </template>
          </template>
        </div>
        <TRCRangeSlider
          v-model="controls.currentMonthRangeIndices"
          :min="0"
          :max="controls.monthRangeMax"
        />
      </div>
    </div>
  </div>
</template>