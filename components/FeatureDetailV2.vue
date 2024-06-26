<script setup lang="ts">
import { useFeatureFlags } from "~/stores/feature-flags";
import { useFeatureProperties, type FeatureProperties } from "~/stores/feature-properties-store";
import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

const { featureId } = defineProps<{ featureId: string }>();

const map = await useMap();
const controls = useMapControlsV2();
const flags = useFeatureFlags();
const featureState = useFeatureState();
const featureProperties = useFeaturePropertiesV2();


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

const log = logger("flyTo");

function flyTo() {
  const { currentSource } = controls;
  const { choroplethLayerId } = useLayerIds(currentSource);

  const [feature] = map.querySourceFeatures(currentSource, {
    sourceLayer: choroplethLayerId,
    filter: ["==", "id", featureId]
  });

  if (feature.geometry.type === "Polygon") {
    const coords = feature.geometry.coordinates.flat();

    let maxLon = 0;
    let maxLat = 0;

    let minLon = Infinity;
    let minLat = Infinity;

    for (let i = 0; i < coords.length; i++) {
      maxLon = Math.max(maxLon, Math.abs(coords[i][0]));
      maxLat = Math.max(maxLat, coords[i][1]);

      minLon = Math.min(minLon, Math.abs(coords[i][0]));
      minLat = Math.min(minLat, coords[i][1]);
    }

    const maxLon_ = maxLon;
    maxLon = -minLon;
    minLon = -maxLon_;

    const size = Math.max(maxLon - minLon, maxLat - minLat);

    log.info({ size, minLat, minLon, maxLat, maxLon })

    map.flyTo({
      center: [
        minLon - (minLon - maxLon) / 2,
        maxLat - (maxLat - minLat) / 2,
      ],
      essential: true,
      zoom: size > 0.2 ? 10 : size > 0.1 ? 11 : 12,
    });
  }
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
          class="h-4 w-4"
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
      <button @click="flyTo">
        Fly to
      </button>
    </div>
    <div v-else>
      ...loading
    </div>
  </div>
</template>