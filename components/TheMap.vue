<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import alderDistrictsJson from "../data/alder-districts.json";

const map = ref<mapboxgl.Map>();

provide("map", map);

onMounted(() => {
    const config = useRuntimeConfig();

    map.value = new mapboxgl.Map({
        accessToken: config.public.mapboxAccessToken,
        style: config.public.mapboxStyleUrl,
        container: "the-map",
        center: [-89.390, 43.07],
        zoom: 11,
    });

    map.value.on("load", () => {
        const _map = map.value!;

        _map.addSource("alder-districts", {
            type: "geojson",
            data: alderDistrictsJson as any,
        });

    });
});

</script>

<template>
    <main class="relative">
        <div id="the-map" class="min-h-screen"></div>
        <slot></slot>
    </main>
</template>
