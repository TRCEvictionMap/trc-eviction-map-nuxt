<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useFloating, autoPlacement, autoUpdate } from "@floating-ui/vue";

const reference = ref(null);
const floating = ref(null);

const { floatingStyles } = useFloating(
  reference,
  floating,
  {
    whileElementsMounted: autoUpdate,
    middleware: [
      autoPlacement(),
    ],
  }
);

</script>

<template>
  <Popover class="relative" #="{ open }: { open: boolean }">
    <PopoverButton ref="reference" class="flex rounded">
      <slot name="button" v-bind="{ open }"></slot>
    </PopoverButton>
    <!-- <Teleport to="body"> -->
      <PopoverPanel
        ref="floating"
        :style="floatingStyles"
        class="p-4 bg-white shadow-lg border rounded max-w-xs z-30"
      >
        <slot v-bind="{ open }"></slot>
      </PopoverPanel>
    <!-- </Teleport> -->
  </Popover>
</template>