<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import alderDistrictsJson from "../data/alder-districts.json";
import { AlderDistricts } from "utils/types";

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
            data: alderDistrictsJson as AlderDistricts,
       });

        _map.addSource("zip-codes", {
            type: "geojson",
            data: alderDistrictsJson as AlderDistricts,
        });

    });
});

</script>

<template>
    <main class="relative flex flex-col">
        <div id="the-map" class="min-h-screen min-w-full"></div>
        <slot></slot>
    </main>
</template>
