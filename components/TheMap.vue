<script setup lang="ts">
// import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// import bgEvictions from "~/public/block-group-evictions.json";

// import { useMapMeta } from "~/stores/map-meta-store";
// import { useMapControls } from "~/stores/map-controls-store";
// import { useFeatureProperties } from "~/stores/feature-properties-store";
// import type { EvictionFeatureCollection, EvictionFeatureProperties } from "utils/types";

// const featureProperties = useFeatureProperties();
// const map = ref<mapboxgl.Map>();

const map = useSetupMap();

provide("map", map);

// onMounted(() => {
//     const config = useRuntimeConfig();
//     const mapMeta = useMapMeta();
//     const mapControls = useMapControls();
    
//     const { _zoom, _lngLat, _source, _year } = useInitialQueryParams();

//     map.value = new mapboxgl.Map({
//         container: "the-map",
//         accessToken: config.public.mapboxAccessToken,
//         style: config.public.mapboxStyleUrlLight,
//         center: _lngLat,
//         zoom: _zoom,
//     });


//     map.value.addControl(
//         new mapboxgl.NavigationControl({
//             visualizePitch: true
//         }),
//         "bottom-right"
//     );

//     mapMeta.lngLat = _lngLat;
//     mapMeta.zoom = _zoom;
//     mapControls.currentSource = _source;
//     mapControls.currentYear = _year;

//     map.value.on("moveend", (ev) => {
//         const { lng, lat } = ev.target.getCenter();
//         mapMeta.lngLat = [lng, lat];
//     });

//     map.value.on("zoomend", (ev) => {
//         mapMeta.zoom = ev.target.getZoom();
//     });

//     map.value.on("load", () => {
//         const _map = map.value!;

//         _map.addSource("block-group-area", {
//             type: "geojson",
//             data: config.app.baseURL + "block-group-area.json"
//         });

//         _map.addSource("block-group-evictions", {
//             type: "geojson",
//             // data: bgEvictions as unknown as string,
//             data: config.app.baseURL + "block-group-evictions.json"
//         });

//         _map.addSource("alder-district-area", {
//             type: "geojson",
//             data: config.app.baseURL + "alder-districts.json"
//         })
//     });

//     featureProperties.data["block-group"] = (bgEvictions as unknown as EvictionFeatureCollection)
//         .features
//         .map((feature) => feature.properties);

// });

</script>

<template>
    <main class="flex flex-col min-h-screen">
        <slot name="control-bar"></slot>
        <div id="the-map" class="relative min-h-screen"></div>
        <slot></slot>
    </main>
</template>
