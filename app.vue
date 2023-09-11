<script setup lang="ts">
import { useMapControls } from '~/stores/map-controls-store';
import { useSelectedFeatures } from '~/stores/selected-features-store';

const map = ref<mapboxgl.Map>();

provide("map", map);

const router = useRouter();
const mapControls = useMapControls();
const selectedFeatures = useSelectedFeatures();

watchEffect(() => {
    router.replace({
        query: {
            source: mapControls.currentSource,
            features: selectedFeatures.items.length
                ? selectedFeatures.items.join(",")
                : undefined,
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
