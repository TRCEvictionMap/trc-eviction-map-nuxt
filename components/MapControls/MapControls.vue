<script setup lang="ts">

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const isDemographicsOpen = useLocalStorageRef("demographics-open", true);
const isEvictionFilingsOpen = useLocalStorageRef("eviction-filings-open", true);

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
</template>