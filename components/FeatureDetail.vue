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
    class="border rounded min-w-[25rem] h-full relative bg-white p-2"
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
      <h2 class="text-xl font-semibold bg-white px-2 pt-4 pb-2 z-10">
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
          <TRCTooltip
            #="{ ref }"
            :text="`
              A ratio representing the number of eviction filings for every
              100 renter-occupied households in a given
              ${controls.currentSourceHumanReadable?.toLowerCase()}
            `"
          >
            <span :ref="ref" class="underline decoration-dashed">
              Eviction Filing Rate
            </span>
          </TRCTooltip>
          <span>{{ feature.filing_rate }}%</span>
        </li>
      </ul>
      <h3 class="font-bold">Census Demographics</h3>
      <h4 class="text-sm italic">2022 ACS 5-Year Estimates</h4>
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th class="text-sm">Measure</th>
            <th class="text-sm">Estimate</th>
            <TRCTooltip #default="props" text="Margin of Error">
              <th v-bind="props" class="text-sm underline decoration-dashed">MOE</th>
            </TRCTooltip>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Poverty Rate</td>
            <td>{{ feature.poverty_rate }}%</td>
            <td>&plusmn;{{ feature.poverty_rate_pct_moe }}%</td>
          </tr>
          <tr>
            <TRCTooltip
              #="{ ref }"
              :text="`
                The percentage of renter-occupied households in a given
                ${controls.currentSourceHumanReadable?.toLowerCase()}
              `"
            >
              <td :ref="ref" class="underline decoration-dashed">Renter Rate</td>
            </TRCTooltip>
            <td>{{ feature.renter_rate }}%</td>
            <!-- <td>&plusmn;{{ feature.renter_rate_moe }}%</td> -->
            <td>-</td>
          </tr>
          <tr>
            <td>Renter-Occupied Households</td>
            <td>{{ feature.renter_count }}</td>
            <!-- <td>&plusmn;{{ feature.renter_count_moe }}</td> -->
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <h4 class="text-sm italic inline-block">
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