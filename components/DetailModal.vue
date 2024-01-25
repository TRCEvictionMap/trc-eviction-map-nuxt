<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useDisclosures } from "~/stores/disclosures-store";
import { useFeatureState } from "~/stores/feature-state-store";

const disclosures = useDisclosures();
const featureState = useFeatureState();

</script>

<template>
  <Dialog
    :open="disclosures.showDetailModal" class="absolute top-0 z-20 w-full h-full flex justify-center items-center"
    @close="disclosures.showDetailModal = false"
  >
    <div class="fixed inset-0 bg-black/30" aria-hidden="true"></div>
    <DialogPanel class="w-full max-w-md transform overflow-auto max-h-[80%] border rounded bg-white p-4 shadow-xl space-y-4">
      <TRCButton class="absolute top-1 right-1" @click="disclosures.showDetailModal = false">
        <IconXMark class="text-slate-500" />
      </TRCButton>
      <DialogTitle>
        Hello!
      </DialogTitle>
      <div>
        How are ya?
      </div>
    </DialogPanel>
  </Dialog>
</template>