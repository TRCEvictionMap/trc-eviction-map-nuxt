import { defineStore } from "pinia";

const useMapMeta = defineStore("map-meta", () => {
    const lngLat = ref<[number, number]>();
    const zoom = ref<number>();

    return { lngLat, zoom };
});

export { useMapMeta };
