<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import bgEvictions from "~/public/block-group-evictions.json";

import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";
import type { EvictionFeatureCollection, EvictionFeatureProperties } from "utils/types";

const featureProperties = useFeatureProperties();
const map = ref<mapboxgl.Map>();

provide("map", map);

onMounted(() => {
    const config = useRuntimeConfig();
    const mapMeta = useMapMeta();
    const mapControls = useMapControls();
    
    const { _zoom, _lngLat, _source, _year } = useInitialQueryParams();

    map.value = new mapboxgl.Map({
        container: "the-map",
        accessToken: config.public.mapboxAccessToken,
        style: config.public.mapboxStyleUrlLight,
        center: _lngLat,
        zoom: _zoom,
    });

    mapMeta.lngLat = _lngLat;
    mapMeta.zoom = _zoom;
    mapControls.currentSource = _source;
    mapControls.currentYear = _year;

    map.value.on("moveend", (ev) => {
        const { lng, lat } = ev.target.getCenter();
        mapMeta.lngLat = [lng, lat];
    });

    map.value.on("zoomend", (ev) => {
        mapMeta.zoom = ev.target.getZoom();
    });

    map.value.on("load", () => {
        const _map = map.value!;

        _map.addSource("block-group-area", {
            type: "geojson",
            data: config.app.baseURL + "block-group-area.json"
        });

        _map.addSource("block-group-evictions", {
            type: "geojson",
            // data: bgEvictions as unknown as string,
            data: config.app.baseURL + "block-group-evictions.json"
        });

        _map.addSource("alder-district-area", {
            type: "geojson",
            data: config.app.baseURL + "alder-districts.json"
        })
    });

    featureProperties.data["block-group"] = (bgEvictions as unknown as EvictionFeatureCollection)
        .features
        .map((feature) => feature.properties);

    // map.value.on("sourcedata", (ev) => {
        // sourceData.loadedSources[ev.sourceId] = ev.isSourceLoaded;
    // });
});

</script>

<template>
    <main class="flex flex-col">
        <div id="the-map" class="min-h-screen"></div>
        <slot></slot>
    </main>
</template>
