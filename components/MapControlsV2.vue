<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
// import { useMapControls } from "~/stores/map-controls-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

defineProps<{ position: "center" | "left" }>();

// const range = ref<[number, number]>([0, 12]);

const controls = useMapControlsV2();

</script>

<template>
  <div
    class="
      hidden absolute top-0 z-10 
      sm:w-auto sm:flex
      sm:top-2 sm:justify-center bg-orange-200
    "
    :class="{
      'sm:self-start sm:ml-2': position === 'left',
      'sm:self-center': position === 'center',
    }"
  >

    <div class="
      flex flex-col justify-center items-center flex-shrink-0 w-full
      p-4 gap-y-4
      rounded border shadow-2xl
      bg-white
    ">
      <div class="hidden sm:flex items-center gap-x-4">
        <TRCSelect
          label="Demographic Metric"
          :options="controls.choroplethMetricOptions"
          v-model="controls.currentChoroplethMetric"
        />
        <TRCSelect
          label="Geography"
          :options="controls.sourceOptions"
          v-model="controls.currentSource"
        />
        <div class="border-r-2 h-11"></div>
        <TRCSelect
          label="Interval"
          :options="controls.timeIntervalOptions"
          v-model="controls.currentTimeInterval"
        />
        <TRCSelect
          label="Year"
          :options="controls.yearOptions"
          v-model="controls.currentYear"
        />
        <TRCSelect
          v-if="controls.currentTimeInterval === 'month'"
          label="Month"
          :options="controls.monthOptions"
          v-model="controls.currentMonth"
        />
      </div>
      <div class="flex flex-col gap-4 w-full">
        <TRCRangeSlider v-model="controls.currentDateRangeIndices" :min="0" :max="controls.dateRangeMax" />
        <pre>{{ controls.currentDateRange }}</pre>
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
        <TRCSelect
          label="Year"
          :options="controls.yearOptions"
          v-model="controls.currentYear"
        />
      </PopoverPanel>
    </Transition>
  </Popover>

</template>
