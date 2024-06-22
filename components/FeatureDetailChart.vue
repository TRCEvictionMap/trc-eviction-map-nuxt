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

const datasets = computed(
  (): Chart["data"]["datasets"] => featureState.selectedFeatures
    .filter((featureId) => Boolean(featureProperties.bgChoropleth[featureId]))
    .map((featureId) => {
      const { bg, tr, filings } = featureProperties.bgChoropleth[featureId];
      return {
        label: `Block Group ${tr}.${bg}`,
        data: Object.values(filings).map(({ c }) => c),
        borderColor: featureState.selectedFeatureColors[featureId],
      };
    }
  )
);

watch(datasets, updateChartDatasets, { immediate: true });

onMounted(() => {
  chartRef.value = markRaw(new Chart(
    assertUnref(canvasRef),
    {
      type: "line",
      options: {
        animation: false,
      },
      data: {
        labels: [],
        datasets: []
      }
    }
  ));

  updateChartDatasets(datasets.value);
});

function updateChartDatasets(datasets: Chart["data"]["datasets"]) {
  try {
    const chart = assertUnref(chartRef);
    chart.data.labels = controls.availableMonthRangeValues;
    chart.data.datasets = datasets;
    chart.update();
  } catch (error) {
    console.warn(error);
  }
}

</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>