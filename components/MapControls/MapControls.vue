<script setup lang="ts">
import { useMapControlsV2 } from '~/stores/map-controls-store-v2';

const controls = useMapControlsV2();

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const isDemographicsOpen = useLocalStorageRef("demographics-open", false);
const isEvictionFilingsOpen = useLocalStorageRef("eviction-filings-open", false);

</script>

<template>
    <div
      class="
        hidden z-40 
        sm:flex sm:w-auto sm:justify-center 
      "
      :class="{
        'relative': !isFloating,
        'absolute top-0 sm:top-2': isFloating,
        'sm:self-start sm:ml-2': isFloating && position === 'left',
        'sm:self-center': isFloating && position === 'center',
      }"
    >
      <div
        class="
          flex flex-col justify-center items-start flex-shrink-0
          rounded flex-1 w-[424px]
          bg-white border py-2
        "
        :class="{
          'shadow-2xl': isFloating
        }"
      >
        <TRCDisclosure :isOpen="isDemographicsOpen" @update:isOpen="isDemographicsOpen = $event">
          <template #heading>
            <h2 class="font-bold">
              Demographics
            </h2>
          </template>
          <MapControlsLayers />
        </TRCDisclosure>
        <TRCDisclosure :isOpen="isEvictionFilingsOpen">
          <template #heading>
            <h2 class="font-bold">
              Eviction Filings
            </h2>
          </template>
          <MapControlsDateRange />
        </TRCDisclosure>
      </div>
    </div>
</template>