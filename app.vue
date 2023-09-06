<script setup lang="ts">
const map = ref<mapboxgl.Map>();

provide("map", map);

const showAlderDistricts = ref(true);

</script>

<template>
    <TheMap>
        <button @click="showAlderDistricts = !showAlderDistricts" class="absolute top-2">
            toggle layers
        </button>
        <ClientOnly>
            <AlderDistricts v-if="showAlderDistricts" />
            <SomeOtherLayer v-else />
        </ClientOnly>
    </TheMap>
</template>
