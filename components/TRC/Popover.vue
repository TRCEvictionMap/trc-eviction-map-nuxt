<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useFloating, autoPlacement, autoUpdate } from "@floating-ui/vue";

defineProps<{ isFloating?: boolean }>();

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
  <Popover class="relative flex flex-1" #="{ open, close }: { open: boolean; close: () => void }">
    <PopoverButton ref="reference" class="flex flex-1 rounded">
      <slot name="button" v-bind="{ open, close }"></slot>
    </PopoverButton>
    <Teleport v-if="isFloating" to="body">
      <PopoverPanel
        ref="floating"
        :style="floatingStyles"
        class="p-4 bg-white shadow-lg border rounded max-w-xs z-30"
      >
        <slot v-bind="{ open, close }"></slot>
      </PopoverPanel>
    </Teleport>
    <PopoverPanel
      v-else
      ref="floating"
      :style="floatingStyles"
      class="p-4 bg-white shadow-lg border rounded max-w-xs z-30"
    >
      <slot v-bind="{ open, close }"></slot>
    </PopoverPanel>
  </Popover>
</template>