<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
  isPopoverOnMobile?: boolean;
}>();

const isDemographicsOpen = useLocalStorageRef("demographics-open", true);
const isEvictionFilingsOpen = useLocalStorageRef("eviction-filings-open", true);

</script>

<template>
    <div
      class="z-40 sm:w-auto sm:justify-center"
      :class="{
        'hidden sm:flex': isPopoverOnMobile,
        'flex': !isPopoverOnMobile,
        'relative': !isFloating,
        'absolute top-0 sm:top-2': isFloating,
        'sm:self-start sm:ml-2': isFloating && position === 'left',
        'sm:self-center': isFloating && position === 'center',
      }"
    >
      <div
        class="
          flex flex-col justify-center items-start flex-shrink-0
          rounded flex-1 w-96
          bg-white border py-2
        "
        :class="{
          'shadow-2xl': isFloating
        }"
      >
        <div class="px-4 py-2">
           <h1 class="font-bold text-lg">TRC Eviction Map</h1>
        </div>
        <TRCDisclosure v-model="isDemographicsOpen">
          <template #heading>
            <h2 class="font-semibold text-slate-800">Demographics</h2>
          </template>
          <MapControlsLayers />
        </TRCDisclosure>
        <TRCDisclosure v-model="isEvictionFilingsOpen" >
          <template #heading>
            <h2 class="font-semibold text-slate-800">Eviction Filings</h2>
          </template>
          <MapControlsDateRange />
        </TRCDisclosure>
      </div>
    </div>

    <Popover
      :class="{
        'absolute z-40 top-2 left-2 sm:hidden w-11/12': isPopoverOnMobile,
        'hidden': !isPopoverOnMobile,
      }"
    >
      <PopoverButton
        class="rounded-full bg-gradient-to-tr from-trc-blue-600 to-trc-blue-500 text-white shadow-2xl shadow-black p-4 border border-trc-blue-100"
        title="Adjust map layers"
      >
        <IconAdjustmentsHorizontal />
      </PopoverButton>
        <Transition
          enterActiveClass="transition duration-200 ease-out"
          enterFromClass="-translate-y-2 opacity-0"
          enterToClass="translate-y-0 opacity-100"
          leaveActiveClass="transition duration-150 ease-in"
          leaveFromClass="translate-y-0 opacity-100"
          leaveToClass="-translate-y-2 opacity-0"
        >
        <PopoverPanel class="absolute  z-10 bg-white rounded border space-y-2 shadow-xl w-full min-w-[]">
          <TRCDisclosure v-model="isDemographicsOpen">
            <template #heading>
              <h2 class="font-semibold text-slate-800">Demographics</h2>
            </template>
            <MapControlsLayers />
          </TRCDisclosure>
          <TRCDisclosure v-model="isEvictionFilingsOpen" >
            <template #heading>
              <h2 class="font-semibold text-slate-800">Eviction Filings</h2>
            </template>
            <MapControlsDateRange />
          </TRCDisclosure>
        </PopoverPanel>
      </Transition>
    </Popover>
</template>