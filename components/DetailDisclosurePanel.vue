<script setup lang="ts">
import { DisclosurePanel } from "@headlessui/vue";

import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

function onClose(close: () => void) {
  disclosures.showDetails = false;
  close();
}

</script>

<template>
  <DisclosurePanel class="h-1/3"  #="{ close }: { close: () => void }">
    <h1 class="font-semibold">Hello!</h1>
    <button @click="() => onClose(close)">
      Close this thing!
    </button>
  </DisclosurePanel>
</template>