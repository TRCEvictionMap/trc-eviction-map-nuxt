import mapboxgl from "mapbox-gl";
import type { Ref } from "vue";


// function useMap() {
//     const map = inject("map") as Ref<mapboxgl.Map>;
//     return map.value;
// }

// function useMapCallback(callback: (map: mapboxgl.Map) => void) {
//     const map = inject("map") as Ref<mapboxgl.Map | undefined>;
    

//     if (map.value && map.value.loaded()) {
//         callback(map.value)
//     }

// }

async function useMap(): Promise<mapboxgl.Map> {
    const map = inject("map") as Ref<mapboxgl.Map>;

    if (map.value && map.value.loaded()) {
        return map.value;
    }

    await nextTick();

    return new Promise((resolve) => {
        if (map.value) {
            map.value.on("load", () => {
                resolve(map.value);
            });
        }
    });

    // if (!map.value || !map.value?.loaded()) {
    //     await nextTick();
        
    //     return new Promise((resolve) => {
    //         if (map.value.loaded()) {
    //             resolve(map.value);
    //         } else {
    //             map.value.on("load", () => {
    //                 resolve(map.value!);
    //             });
    //         }
    //     });
    // }

    // return 
}

export { useMap };