<script setup lang="ts">
import { useSettings } from "~/stores/settings-store";

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});


</script>

<template>
  <Teleport to="#main-content" v-if="isMounted">
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
          rounded flex-1 w-[500px]
          bg-white border
        "
        :class="{
          'shadow-2xl': isFloating
        }"
      >
        <TRCDisclosure heading="Layers" >
            <MapControlsLayers />
        </TRCDisclosure>
        <TRCDisclosure heading="Date Range">
  
          <MapControlsDateRange />
  
        </TRCDisclosure>
      </div>
    </div>
  </Teleport>
</template>