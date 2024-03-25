<script setup lang="ts">
import { DisclosurePanel } from "@headlessui/vue";

import { useMapControls } from "~/stores/map-controls-store";
import { useDisclosures } from "~/stores/disclosures-store";
import { useFeatureState } from "~/stores/feature-state-store";

const controls = useMapControls();
const disclosures = useDisclosures();
const featureState = useFeatureState();

watch(() => featureState.selectedFeatures.length, (nSelectedFeatures) => {
  if (nSelectedFeatures === 0) {
    disclosures.showDetails = false;
  }
}, { immediate: true });

</script>

<template>
  <DisclosurePanel
    class="
      h-1/2 top-0 pb-2 border-t border-trc-blue-700/20 bg-slate-100 
      flex flex-col items-center overflow-auto
    "
  >
    <button
      class="
        rounded shadow-lg mt-4 sticky left-[calc(50%-64px)] w-32
        bg-trc-blue-500 text-white p-2 font-mono text-sm font-bold
      "
      @click="() => disclosures.showDetails = false"
    >
      <span>Hide details</span>
    </button>
    <div class="
      flex flex-col justify-center items-center space-y-4 mt-4 m-auto px-4
      sm:flex-row sm:space-x-4 sm:space-y-0
    ">
      <FeatureDetail
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
      <FeatureDetailPlaceholder v-for="n in 3 - featureState.selectedFeatures.length"  />
      <!-- <div
        v-for="n in 3 - featureState.selectedFeatures.length"
        :key="`placeholder-${n}`"
        class="border rounded w-[22rem] sm:w-[24rem] h-full relative bg-slate-300/50 flex justify-center py-10"
      >
        <h3 class="font-bold text-slate-700">
          Select another {{ controls.currentSourceHumanReadable }}
        </h3>
      </div> -->
    </div>
  </DisclosurePanel>
</template>

