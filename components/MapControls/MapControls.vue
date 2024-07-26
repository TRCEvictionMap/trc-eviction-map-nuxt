<script setup lang="ts">

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

</script>

<template>
  <NavMenu>
    <template #items="props">
      <NavMenuTrigger v-bind="props" menuName="layers">
        Layers
      </NavMenuTrigger>
      <NavMenuTrigger v-bind="props" menuName="date-range">
        Date Range
      </NavMenuTrigger>
    </template>
    <template #content="{ activeMenu }">
      <MapControlsLayers v-if="activeMenu === 'layers'" class="w-[460px]" />
      <MapControlsDateRange v-else-if="activeMenu === 'date-range'" class="w-[440px]" />
    </template>
  </NavMenu>
</template>