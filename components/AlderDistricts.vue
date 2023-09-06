<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { useMap } from "../composables/use-map";

const map = await useMap();

const layers: mapboxgl.AnyLayer[] = [
    {
        id: "alder-districts",
        type: "fill",
        source: "alder-districts",
        paint: {
            "fill-color": "limegreen",
            "fill-opacity": 0.1,
        },
    },
    {
        id: "alder-district-borders",
        type: "line",
        source: "alder-districts",
        paint: {
            
            "line-width": [
                "case",
                ["boolean", ["feature-state", "isHovered"], ["feature-state", "isSelected"], false],
                3,
                1
            ]
        },
    },
    {
        id: "selected-alder-district-borders",
        type: "line",
        source: "alder-districts",
        paint: {
            "line-color": [
                "case",
                ["boolean", ["feature-state", "isSelected"], false],
                "hotpink",
                "black",
            ],
            "line-width": [
                "case",
                ["boolean", ["feature-state", "isSelected"], false],
                3,
                1,
            ],
        },
    },
];

onMounted(() => {
    layers.forEach((layer) => {
        map.addLayer(layer);
    });
});

onBeforeUnmount(() => {
    layers.forEach((layer) => {
        map.removeLayer(layer.id);
    });
});

</script>

<template></template>