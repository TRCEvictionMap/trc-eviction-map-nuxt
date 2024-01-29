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
    class="h-1/2 relative overflow-auto pb-2 border-t border-trc-blue-700/20 bg-slate-100"
    #="{ close }: { close: () => void }"
  >
    <button
      class="flex items-center space-x-2 sticky left-1 top-1 rounded shadow-lg bg-trc-blue-500 text-white p-2 font-mono text-sm font-bold"
      @click="() => onClose(close)"
    >
      <span>Close</span>
      <IconXMark />
    </button>
    <div class="flex justify-center space-x-4">
      <FeatureDetail
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
    </div>
  </DisclosurePanel>
</template>

<!-- <template>
  <DisclosurePanel
    class="h-1/2 relative overflow-auto pb-2 border-t border-trc-blue-700/20 bg-slate-100"
    #="{ close }: { close: () => void }"
  >
    <button
      class="flex items-center space-x-2 sticky left-1 top-1 rounded shadow-lg bg-trc-blue-500 text-white p-2 font-mono text-sm font-bold"
      @click="() => onClose(close)"
    >
      <span>Close</span>
      <IconXMark />
    </button>
    <div class="flex justify-center space-x-4 bg-orange-300 relative overflow-x-auto w-screen">
      <FeatureDetail
        v-for="featureId in featureState.selectedFeatures"
        :key="featureId"
        :featureId="featureId"
      />
    </div>
  </DisclosurePanel>
</template> -->