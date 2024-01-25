<script setup lang="ts">
import { DisclosureButton } from "@headlessui/vue";

import { useDisclosures } from "~/stores/disclosures-store";
import { useFeatureState } from "~/stores/feature-state-store";

const disclosures = useDisclosures();
const featureState = useFeatureState();

</script>

<template>
  <DisclosureButton
    class="rounded shadow-lg border border-trc-blue-500 bg-trc-blue-500 text-white p-2 font-mono text-sm font-bold"
    @click="disclosures.showDetails = !disclosures.showDetails"
  >
    {{ featureState.selectedFeatures.length > 1 ? 'Compare' : 'Show' }} details
  </DisclosureButton>
</template>