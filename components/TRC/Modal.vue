<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";

defineOptions({ inheritAttrs: false });

defineProps<{
  open: boolean;
}>();

defineEmits([
  "close"
]);

</script>

<template>
  <Dialog :open="open" @close="$emit('close')" as="div" class="relative z-50 min-h-screen flex justify-center items-center">
    <div class="fixed inset-0 bg-black/40" aria-hidden="true"></div>
    <DialogPanel 
      class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
      v-bind="$attrs"
    >
      <slot></slot>
    </DialogPanel>
  </Dialog>
</template>