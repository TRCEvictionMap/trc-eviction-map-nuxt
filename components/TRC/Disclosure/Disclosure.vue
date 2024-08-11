<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import DisclosureStateTracker from "./DisclosureStateTracker.vue";

defineProps<{ isOpen?: boolean, heading?: string }>();

defineEmits<{ "update:isOpen": [boolean] }>();

</script>

<template>
  <Disclosure :defaultOpen="isOpen" #="{ open }: { open: boolean }" as="div" class="w-full ">
    <div
      class="flex flex-col w-full px-4 py-1 transition-all"
      :class="{
        ' bg-transparent': !open,
        ' bg-white pb-4': open
      }"
    >
      <DisclosureButton class="flex justify-between">
        <div
          class="font-semibold flex-1 flex justify-between py-1"
          :class="{
            'pb-4': open,
          }"
        >
          <slot name="heading">
            <h2>{{ heading }}</h2>
          </slot>
          <div class="relative">
            <IconMinus class="absolute right-0 w-4 h-4" />
            <IconMinus
              class="absolute right-0 transition-transform"
              :class="{
                'rotate-0': open,
                'rotate-90': !open
              }"
            />
          </div>
        </div>
      </DisclosureButton>
      <DisclosurePanel static>
        <DisclosureStateTracker :isOpen="open" @update:isOpen="$emit('update:isOpen', $event)" />
        <div v-if="open">
          <slot></slot>
        </div>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>