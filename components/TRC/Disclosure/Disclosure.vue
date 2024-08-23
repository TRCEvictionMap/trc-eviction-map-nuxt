<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import DisclosureStateTracker from "./DisclosureStateTracker.vue";

const props = defineProps<{ modelValue: boolean, heading?: string }>();

const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const isOpen = computed({
  get() {
    return props.modelValue;
  },
  set(isOpen) {
    emit("update:modelValue", isOpen);
  },
});

</script>

<template>
  <Disclosure
    :defaultOpen="isOpen"
    #="{ open }: { open: boolean }"
    as="div"
    class="w-full"
  >
    <div
      class="flex flex-col w-full px-4 py-1 transition-all"
      :class="{
        'bg-transparent': !open,
        'bg-white pb-4': open
      }"
    >
      <DisclosureButton class="flex justify-between">
        <div
          class="flex-1 flex justify-between py-1"
          :class="{
            'pb-4': open,
          }"
        >
          <slot name="heading">
            <h2>{{ heading }}</h2>
          </slot>
          <div class="relative">
            <IconChevronUp
              class="transition w-4 h-4"
              :class="{ 'rotate-0': open, 'rotate-180': !open }"
            />
          </div>
        </div>
      </DisclosureButton>
      <DisclosurePanel static>
        <DisclosureStateTracker :isOpen="open" @update:isOpen="isOpen = $event" />
        <div v-if="open">
          <slot></slot>
        </div>
      </DisclosurePanel>
    </div>
  </Disclosure>
</template>