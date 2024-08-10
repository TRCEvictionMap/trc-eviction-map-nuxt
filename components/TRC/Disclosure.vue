<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

defineProps<{ heading?: string }>();

</script>

<template>
  <Disclosure #="{ open }: { open: boolean }" as="div" class="w-full ">
    <div
      class="flex flex-col w-full px-4 py-1 transition-all"
      :class="{
        ' bg-transparent': !open,
        ' bg-white pb-4': open
      }"
    >
      <DisclosureButton class="flex justify-between">
        <div
          class="font-semibold text-lg flex-1 flex justify-between py-2"
          :class="{
            'pb-4': open
          }"
        >
          <slot name="heading">
            <span>{{ heading }}</span>
          </slot>
          <div class="relative">
            <IconMinus class="absolute right-0" />
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
      <DisclosurePanel>
        <slot></slot>

      </DisclosurePanel>
    </div>
  </Disclosure>
</template>