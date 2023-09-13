<script setup lang="ts">
import { useMapMeta } from '~/stores/map-meta-store';
import { useMapControls } from '~/stores/map-controls-store';
import { useSelectedFeatures } from '~/stores/selected-features-store';

const map = ref<mapboxgl.Map>();

provide("map", map);

const router = useRouter();
const mapControls = useMapControls();
const mapMeta = useMapMeta();
const selectedFeatures = useSelectedFeatures();

watchEffect(() => {
    router.replace({
        query: {
            source: mapControls.currentSource,
            features: selectedFeatures.items.length
                ? selectedFeatures.items.join(",")
                : undefined,
            center: mapMeta.lngLat
                ? mapMeta.lngLat.join(",")
                : undefined,
            zoom: mapMeta.zoom,
        },
    });
});

</script>

<template>
    <TheMap>
        <ClientOnly>
           <ControlBar />
           <DetailCardGroup />
           <MapLayers />
        </ClientOnly>
    </TheMap>
</template>
