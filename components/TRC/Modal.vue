<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
</script>

<template>
  <Dialog as="div" class="relative z-10 min-h-screen flex justify-center items-center">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
      <slot></slot>
    </DialogPanel>
  </Dialog>
</template>