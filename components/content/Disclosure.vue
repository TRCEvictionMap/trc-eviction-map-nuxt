<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineProps<{
  title: string;
}>();

</script>

<template>
  <Disclosure v-slot="{ open }: { open: boolean }" as="div" class="flex flex-col py-2">
    <DisclosureButton
      class="font-semibold text-lg flex justify-between p-2"
      :class="{
        'text-trc-orange-500': open,
        'text-slate-800': !open,
      }"
    >
      <span>
        {{ title }}
      </span>
      <div class="relative">
        <IconMinus class="absolute right-0" />
        <IconMinus
          class="absolute right-0 rotate-90 transition-transform"
          :class="{
            'rotate-0': open
          }"
        />
      </div>
    </DisclosureButton>
    <DisclosurePanel class="px-2">
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>