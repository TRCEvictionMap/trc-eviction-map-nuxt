<script setup lang="ts">
import { useFeatureProperties, type FeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";

const controls = useMapControls();
const featureState = useFeatureState();
const featureProperties = useFeatureProperties();

const { featureId } = defineProps<{ featureId: string }>();

const feature = computed(() => {
  const { evictions, id, ...properties } = featureProperties.getFeatureProperties(
    controls.currentSource,
    featureId
  ) as FeatureProperties;

  return {
    ...properties,
    ...evictions[controls.currentYear],
    id: id.replace(/\w_/, ""),
  };
});

const isHovered = computed(() => featureState.hoveredFeature === featureId);

function closeCard() {
  if (featureId) {
    featureState.setFeatureState(featureId, "isSelected", false);
    featureState.setFeatureState(featureId, "isHovered", false);
  }
}

function onMouseover() {
  featureState.setFeatureState(featureId, "isHovered", "card");
}

function onMouseleave() {
  featureState.setFeatureState(featureId, "isHovered", false);
}

</script>

<template>
  <div
    class="border rounded w-96 h-full relative bg-white p-2"
    :class="{
      'ring-2 ring-black': isHovered
    }"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div class="sticky top-0">
      <TRCButton class="absolute top-1 right-1 z-30 hover:bg-slate-200" @click="closeCard">
        <IconXMark class="text-slate-500" />
      </TRCButton>
      <h2 class="text-xl font-semibold bg-white px-2 pt-4 pb-2">
        {{ feature.region }} {{ feature.id }}
      </h2>
    </div>
    <div class="p-2 space-y-4">
      <h3 class="font-bold">Evictions</h3>
      <h4 class="text-sm italic">Eviction statistics for {{ controls.currentYear }}</h4>
      <ul class="space-y-1">
        <li class="flex justify-between items-center">
          <span>Total Eviction Filings</span>
          <span>{{ feature.n_filings }}</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Eviction Filing Rate</span>
          <span>{{ feature.filing_rate }}</span>
        </li>
      </ul>
      <h3 class="font-bold">Census Demographics</h3>
      <h4 class="text-sm italic">2022 ACS 5-Year Estimates</h4>
      <ul class="space-y-1">
        <li class="flex justify-between items-center">
          <span>Poverty Rate</span>
          <span>{{ feature.poverty_rate }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Poverty Rate Margin of Error</span>
          <span>&plusmn;{{ feature.poverty_rate_pct_moe }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Renter Rate</span>
          <span>{{ feature.renter_rate }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Total Renter Households</span>
          <span>{{ feature.renter_count }}</span>
        </li>
      </ul>
      <h4 class="text-sm italic">
        2020 Decennial Census
      </h4>
      <ul class="space-y-1">
        <li class="flex justify-between items-center">
          <span>Percent American Indian</span>
          <span>{{ feature.race.pct_ai }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Percent Asian</span>
          <span>{{ feature.race.pct_as }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Percent Black</span>
          <span>{{ feature.race.pct_bl }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Percent Multiple Races</span>
          <span>{{ feature.race.pct_multi }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Percent Other</span>
          <span>{{ feature.race.pct_other }}%</span>
        </li>
        <li class="flex justify-between items-center">
          <span>Percent Pacific Islander</span>
          <span>{{ feature.race.pct_pi }}%</span>
        </li>

        <li class="flex justify-between items-center">
          <span>Percent White</span>
          <span>{{ feature.race.pct_wh }}%</span>
        </li>
      </ul>
    </div>
  </div>
</template>