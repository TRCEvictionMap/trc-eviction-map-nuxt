<script setup lang="ts">
import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";

import { useFeatureState } from "~/stores/feature-state-store";

const router = useRouter();
const mapControls = useMapControls();
const mapMeta = useMapMeta();
const featureState = useFeatureState();

const konami = useKonamiCode();

watchEffect(() => {
    router.replace({
        query: {
            source: mapControls.currentSource,
            year: mapControls.currentYear,
            features: featureState.selectedFeatures.length
                ? featureState.selectedFeatures.join(",")
                : undefined,
            center: mapMeta.lngLat
                ? mapMeta.lngLat.join(",")
                : undefined,
            zoom: mapMeta.zoom,
        },
    });
});

onMounted(() => {
    window.addEventListener("keydown", konami.recordKeyPress);
});

onUnmounted(() => {
    window.removeEventListener("keydown", konami.recordKeyPress);
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
    <SettingsDialog :open="konami.didKonami" @close="konami.reset" />
</template>
