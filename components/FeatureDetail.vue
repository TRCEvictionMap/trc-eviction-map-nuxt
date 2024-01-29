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
    class="border rounded w-[22rem] sm:w-[24rem] h-full relative bg-white"
    :class="{
      'ring-2 ring-black': isHovered
    }"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div class="sticky top-0 z-10 px-2">
      <TRCButton class="absolute top-1 right-1 hover:bg-slate-200" @click="closeCard">
        <IconXMark class="text-slate-500" />
      </TRCButton>
      <h2 class="text-xl font-semibold bg-white pt-4 pb-2 ">
        {{ feature.region }} {{ feature.id }}
      </h2>
      <hr>
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
            <th class="text-sm flex items-center space-x-0.5">
              <span>
                MOE
              </span>
              <TRCInfoPopover iconSize="sm">
                <h2 class="font-semibold">
                  Margin of Error (MOE)
                </h2>
                <p class="text-sm">
                  American Community Survey (ACS) data are estimates. The <span class="italic">margin of error</span> 
                  is an indicator of how precise a given estimate is. For more information, check out
                  <NuxtLink
                    href="https://www.census.gov/content/dam/Census/library/publications/2018/acs/acs_general_handbook_2018_ch07.pdf"
                    target="_blank"
                    class="text-trc-orange-500 underline"
                  >
                    "Understanding Error and Determining Statistical Significance"
                  </NuxtLink>
                  from the U.S. Census Bureau.
                </p>
              </TRCInfoPopover>
            </th>
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
            <td>Total Renter Households</td>
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