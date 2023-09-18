<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import alderDistrictsJson from "../data/alder-districts.json";
import zipcodesJson from "../data/zip-codes.json";
import blockGroupsJson from "../data/block-groups.json";
import { AlderDistricts } from "utils/types";
import { useMapMeta } from "~/stores/map-meta-store";
import "mapbox-gl/dist/mapbox-gl.css";

const map = ref<mapboxgl.Map>();

provide("map", map);

onMounted(() => {
    const config = useRuntimeConfig();
    const mapMeta = useMapMeta();

    map.value?.setCenter([23,23])
    map.value = new mapboxgl.Map({
        container: "the-map",
        accessToken: config.public.mapboxAccessToken,
        style: config.public.mapboxStyleUrlLight,
        center: mapMeta.lngLat,
        zoom: mapMeta.zoom,
    });

    map.value.on("moveend", (ev) => {
        const { lng, lat } = ev.target.getCenter();
        mapMeta.lngLat = [lng, lat];
    });

    map.value.on("zoomend", (ev) => {
        mapMeta.zoom = ev.target.getZoom();
    });

    map.value.on("load", () => {
        const _map = map.value!;

        _map.addSource("alder-districts", {
            type: "geojson",
            data: alderDistrictsJson as AlderDistricts,
        });

        _map.addSource("zip-codes", {
            type: "geojson",
            data: zipcodesJson as any,
        });

        _map.addSource("block-groups", {
            type: "geojson",
            data: blockGroupsJson as any,
        });

    });
});

</script>

<template>
    <main class="flex flex-col">
        <div id="the-map" class="min-h-screen"></div>
        <slot></slot>
    </main>
</template>
