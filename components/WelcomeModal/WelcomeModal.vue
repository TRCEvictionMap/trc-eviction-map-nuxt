<script setup lang="ts">
import CustomH2 from './CustomH2.vue';
import CustomH3 from './CustomH3.vue';
import CustomH4 from "./CustomH4.vue";

const dontShowAgain = useLocalStorage(
  "dont-show-again",
  false
);

const show = ref(!dontShowAgain.value);

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
  <TRCModal :open="show && Boolean(welcomeModalContent)" @close="show = false">
    <div class="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:mt-0">
      <ContentRenderer :components="components" :value="welcomeModalContent" />
    </div>
    <div class="flex justify-end gap-4">
      <div class="flex items-center gap-2">
        <label for="never-show">Don't show again</label>
        <input id="never-show" type="checkbox" v-model="dontShowAgain" />
      </div>
      <button class="button border " @click="show = false">
        Dismiss
      </button>
    </div>
  </TRCModal>
</template>