<script setup lang="ts">
import { Chart } from "chart.js/auto";

import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const controls = useMapControlsV2();
const featureState = useFeatureState();
const featureProperties = useFeaturePropertiesV2();

const canvasRef = ref<HTMLCanvasElement>();
const chartRef = ref<Chart>();

watch(
  () => controls.availableMonthRangeValues,
  (availableMonthRangeValues) => {
    try {
      const chart = assertUnref(chartRef);

      chart.data.labels = availableMonthRangeValues;
      chart.data.datasets[0].data = [1,2,3,4,5];
      console.log("hekeii")

    } catch (error) {
      
    }
  },
  { immediate: true }
)

onMounted(() => {
  chartRef.value = new Chart(
    assertUnref(canvasRef),
    {
      type: "line",
      options: {
        onResize(chart, size) {
          console.log(chart, size)
        },
      },
      data: {
        labels: controls.availableMonthRangeValues,
        datasets: [
          {
            label: "Eviction filings per month",
            data: [3, 3, 4]
          }
        ]
      }
    }
  )
});

</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>