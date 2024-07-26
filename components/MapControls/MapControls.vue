<script setup lang="ts">
import { useSettings } from "~/stores/settings-store";

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

</script>

<template>
  <NavMenu>
    <template #triggers>
      <NavMenuTrigger menuName="layers">
        Layers
      </NavMenuTrigger>
      <NavMenuTrigger menuName="date-range">
        Date Range
      </NavMenuTrigger>
    </template>
    <template #content="{ activeMenu }">
      <MapControlsLayers v-if="activeMenu === 'layers'" class="w-[460px]" />
      <MapControlsDateRange v-else-if="activeMenu === 'date-range'" class="w-[440px]" />
    </template>
  </NavMenu>
</template>