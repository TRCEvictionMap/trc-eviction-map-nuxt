<script setup lang="ts">
import { DisclosurePanel } from "@headlessui/vue";

import { useDisclosures } from "~/stores/disclosures-store";
import { useFeatureState } from "~/stores/feature-state-store";

const disclosures = useDisclosures();
const featureState = useFeatureState();

function onClose(close: () => void) {
  disclosures.showDetails = false;
  close();
}

</script>

<template>
  <DisclosurePanel
    class="
      h-1/2 top-0 pb-2 border-t border-trc-blue-700/20 bg-slate-100 
      elative flex flex-col items-center  overflow-auto
    "
    #="{ close }: { close: () => void }"
  >
    <button
      class="
        rounded shadow-lg mt-4
        bg-trc-blue-500 text-white p-2 font-mono text-sm font-bold
      "
      @click="() => onClose(close)"
    >
      <span>Hide details</span>
    </button>
    <div class="
      flex flex-col justify-center items-center space-y-4 mt-4
      sm:flex-row sm:space-x-4 sm:space-y-0 
    ">
      <FeatureDetail
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
    </div>
  </DisclosurePanel>
</template>

