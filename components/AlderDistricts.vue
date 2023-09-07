<script setup lang="ts">
const map = await useMap();

useSource(map, "alder-districts");

</script>

<template>
    <div class="absolute bg-black text-white top-12 left-2">
        AlderDistricts
    </div>
</template>