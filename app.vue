<script setup lang="ts">
import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";

import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";

const router = useRouter();
const mapControls = useMapControls();
const mapMeta = useMapMeta();
const featureState = useFeatureState();
const settings = useSettings();

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

function onCloseSettingsMenu() {
    konami.reset();
    settings.showDialog = false;
}

onMounted(() => {
    window.addEventListener("keydown", konami.recordKeyPress);
});

onUnmounted(() => {
    window.removeEventListener("keydown", konami.recordKeyPress);
});
</script>

<template>
    <ClientOnly>
        <TheMap>
            <template #control-bar>
                <ControlBar />
            </template>
           <DetailCardGroup />
           <MapLayers />
           <SettingsDialog :open="konami.didKonami || settings.showDialog" @close="onCloseSettingsMenu" />
        </TheMap>
    </ClientOnly>
</template>
