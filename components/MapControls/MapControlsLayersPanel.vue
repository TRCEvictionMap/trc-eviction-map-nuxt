<script setup lang="ts">
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const controls = useMapControlsV2();

</script>

<template>
  <div>
    <h1>Layers</h1>
    <div class="flex items-center flex-wrap gap-y-4 gap-x-6">
      <TRCSelect
        label="Geography"
        class="z-10"
        :options="controls.sourceOptions"
        v-model="controls.currentSource"
      />
      <TRCSelect
        label="Demographic Metric"
        class="min-w-[208px] z-50"
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
</template>