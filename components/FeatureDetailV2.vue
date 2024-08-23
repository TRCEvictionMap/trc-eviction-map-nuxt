<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureProperties, type FeatureProperties } from "~/stores/feature-properties-store";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const { featureId } = defineProps<{ featureId: string }>();

const controls = useMapControlsV2();
const flags = useFeatureFlags();
const featureState = useFeatureState();
const featureProperties = useFeaturePropertiesV2();

const flyTo = await useFlyTo();

const isHovered = computed(() => featureState.hoveredFeature === featureId);

const featureColor = computed(() => {
  if (!flags.disableMultiColorFeatureOutline) {
    return featureState.selectedFeatureColors[featureId];
  }
});

const data = computed(() => featureProperties.bgChoropleth[featureId]);

const filingCount = computed(
  () => featureProperties.currentMonthRangeFilingCount[featureId]
);

const rangeDescription = computed(() => {
  const range = controls.currentMonthRangeHumanReadable;
  if (range) {
    const { isSingle, start, end } = range;
    if (isSingle) {
      return `From the beginning, to the end of ${start.m} ${start.y}`;
    }
    return `From the beginning of ${start.m} ${start.y} through the end of ${end.m} ${end.y}`;
  }
  return "";
});

function deselectFeature() {
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
    class="border rounded bg-white relative p-4 ring-1 ring-black max-w-lg"
    :class="{
      'ring-2': isHovered,
    }"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div>
      <TRCButton class="absolute top-2 right-2 hover:bg-slate-300/40" @click="deselectFeature">
        <IconXMark class="text-slate-500" />
      </TRCButton>
    </div>
    <div v-if="data" class="space-y-2">
      <div class="flex items-center gap-2">
        <div
          v-if="featureColor"
          class="h-4 w-4 rounded-full"
          :class="{
            'bg-[#ff7f00]': featureColor === '#ff7f00',
            'bg-[#4daf4a]': featureColor === '#4daf4a',
            'bg-[#984ea3]': featureColor === '#984ea3',
          }"
        ></div>
        <h2 class="font-semibold">
          {{ controls.currentSourceHumanReadable }} {{ data.tr }}.{{ data.bg }}
        </h2>
      </div>
      <p>
        <span class="font-semibold">{{ filingCount.currentWindow }}</span> evictions were
        filed in this {{ controls.currentSourceHumanReadable }} within the
        <TRCTooltip #="props" :text="rangeDescription">
          <span v-bind="props">
            current date range.
          </span>
        </TRCTooltip>
      </p>
      <div class="flex justify-end gap-2">
        <button
          @click="flyTo(featureId)"
          class="button-fly-to"
        >
          Fly to on map
        </button>
      </div>
    </div>
    <div v-else>
      ...loading
    </div>
  </div>
</template>

<style scoped>
.button-fly-to {
  @apply outline-none px-2 py-1 rounded font-semibold transition border border-transparent
        hover:border-slate-900
        focus:ring focus:ring-trc-blue-400 focus:ring-offset-2 focus:border-slate-800
  /* @apply outline-none px-2 py-1 rounded font-semibold transition
        hover:bg-slate-900 hover:text-white
        focus:ring focus:ring-trc-blue-400 focus:ring-offset-2 focus:bg-slate-800 focus:text-white */
  }
</style>