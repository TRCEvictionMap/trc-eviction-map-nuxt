<script setup lang="ts">
import { useDisclosures } from '~/stores/disclosures-store';
import CustomH2 from './CustomH2.vue';
import CustomH3 from './CustomH3.vue';
import CustomH4 from "./CustomH4.vue";

const disclosures = useDisclosures();

const showOnPageLoad = useLocalStorage(
  "show-on-page-load",
  true
);

const show = ref(showOnPageLoad.value);

function closeModal() {
  show.value = false;
  disclosures.showWelcomeModal = false;
}

const { data: welcomeModalContent } = await useAsyncData(
  "welcome-modal-content",
  () => queryContent("/welcome-modal-content").findOne()
);

const components = {
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
};

</script>

<template>
  <TRCModal
    :open="disclosures.showWelcomeModal || (show && Boolean(welcomeModalContent))"
    @close="closeModal"
    class="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:mt-0 !bg-slate-100"
  >
    <section class="px-6 pt-6 relative flex justify-between items-center">
      <h2>Welcome to Tenant Resource Center Eviction Map</h2>
      <TRCButton @click="closeModal" class="absolute top-4 right-4 hover:bg-slate-300/40">
        <IconXMark />
      </TRCButton>
    </section>
    <section class="relative overflow-auto max-h-[70vh] bg-white px-6">
      <ContentRenderer :use="$slots.default" :components="components" :value="welcomeModalContent" />
    </section>
    <section class="flex justify-end gap-4 px-6 py-4">
      <div class="flex items-center gap-2">
        <label for="never-show">Show on page load</label>
        <input id="never-show" type="checkbox" v-model="showOnPageLoad" />
      </div>
      <button class="px-6 py-2 rounded bg-trc-blue-600 text-white" @click="closeModal">
        Ok
      </button>
    </section>
  </TRCModal>
</template>