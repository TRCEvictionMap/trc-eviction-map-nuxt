import mapboxgl from "mapbox-gl";
import type { Ref } from "vue";

async function useMap(): Promise<mapboxgl.Map> {
    const map = inject<Ref<mapboxgl.Map>>("map");

    if (map && map.value && map.value.loaded()) {
        return map.value;
    }

    await nextTick();

    // watch(map as Ref<mapboxgl.Map>, (m) => {
    //     console.log(m);
    // }, { immediate: true });
    
    return new Promise((resolve) => {
        if (map && map.value) {
            if (map.value.isStyleLoaded()) {
                resolve(map.value);
            } else {
                map.value.on("load", () => {
                    resolve(map.value);
                });
            }
        }
    });
}

export { useMap };