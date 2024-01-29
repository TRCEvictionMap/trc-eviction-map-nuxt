<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useFloating, autoPlacement, autoUpdate } from "@floating-ui/vue";

interface Props {
  iconSize: "sm" | "md";
}

withDefaults(
  defineProps<Props>(),
  {
    iconSize: "md",
  }
);

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
  <Popover class="relative">
    <PopoverButton ref="reference" class="flex">
      <IconInformationCircle :class="{
        'h-[18px] w-[18px]': iconSize === 'sm',
        'h-5 w-5': iconSize === 'md',
      }" />
    </PopoverButton>
    <Teleport to="body">
      <PopoverPanel
        ref="floating"
        :style="floatingStyles"
        class="p-4 bg-white shadow-lg border rounded max-w-xs z-10"
      >
        <slot></slot>
      </PopoverPanel>
    </Teleport>
  </Popover>
</template>