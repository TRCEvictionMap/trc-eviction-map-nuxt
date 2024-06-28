<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const controls = useMapControlsV2();

const range = computed(
  () => controls.currentMonthRangeHumanReadable
);

</script>

<template>
  <div
    class="
      hidden z-10 
      sm:flex sm:w-auto
      sm:justify-center 
    "
    :class="{
      'relative': !isFloating,
      'absolute top-0 sm:top-2': isFloating,
      'sm:self-start sm:ml-2': isFloating && position === 'left',
      'sm:self-center': isFloating && position === 'center',
    }"
  >
    <div
      class="
        flex flex-col justify-center items-start flex-shrink-0 w-full
        p-4 gap-y-4
        rounded flex-1 max-w-[490px]
        bg-white border
      "
      :class="{
        'shadow-2xl': isFloating
      }"
    >
      <div class="hidden sm:block relative z-10 space-y-4">
        <div class="space-y-2">
          <h2 class="text-lg font-bold">Map Filters</h2>
          <div class="flex items-center flex-wrap gap-y-4 gap-x-6">
            <TRCSelect
              label="Geography"
              class="z-10"
              :options="controls.sourceOptions"
              v-model="controls.currentSource"
            />
            <TRCSelect
              label="Demographic Metric"
              class="min-w-[208px] z-10"
              :options="controls.choroplethMetricOptions"
              v-model="controls.currentChoroplethMetric"
            />
            <TRCSwitch
              stackLabel
              :label="`${controls.showHeatmap ? 'Hide' : 'Show'} Heatmap`"
              v-model="controls.showHeatmap"
            />
          </div>
        </div>
      </div>
      <div class="w-full border"></div>
      <div class="flex flex-col gap-4 w-full">
        <div class="space-y-2 flex flex-col">
          <h2 class="text-lg font-bold">Filing Date Range</h2>
          <p>
            Use these controls to adjust the window of time for which eviction filing data is presented.
          </p>
        </div>
        <div class="flex flex-wrap gap-y-4 gap-x-6">
          <div class="space-y-2 flex-1">
            <div class="font-mono font-bold text-sm whitespace-nowrap">
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
          <TRCSelect
            class=""
            label="Range Size"
            :options="controls.timeIntervalOptions"
            v-model="controls.currentMonthRangeSize"
          />
        </div>
      </div>
    </div>
  </div>

  <Popover class="absolute top-2 left-2 sm:hidden">
    <PopoverButton
      class="rounded-full bg-trc-blue-700 text-white shadow-2xl p-4 "
      title="Adjust map layers"
    >
      <IconAdjustmentsHorizontal />
    </PopoverButton>
    <Transition
      enterActiveClass="transition duration-200 ease-out"
      enterFromClass="translate-y-1 opacity-0"
      enterToClass="translate-y-0 opacity-100"
      leaveActiveClass="transition duration-150 ease-in"
      leaveFromClass="translate-y-0 opacity-100"
      leaveToClass="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute z-10 max-w-sm bg-white rounded border p-4 space-y-2 shadow-xl">
        <TRCSelect
          label="Demographic Metric"
          :options="controls.choroplethMetricOptions"
          v-model="controls.currentChoroplethMetric"
        />
        <TRCSelect
          label="Region"
          :options="controls.sourceOptions"
          v-model="controls.currentSource"
        />
      </PopoverPanel>
    </Transition>
  </Popover>

</template>
