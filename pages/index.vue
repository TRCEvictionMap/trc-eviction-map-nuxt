<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

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

const unwatch = watchEffect(() => {
    router.replace({
        query: {
            source: mapControls.currentSource,
            year: mapControls.currentYear,
            e_metric: mapControls.currentEvictionMetric,
            d_metric: mapControls.currentDemographicMetric,
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

onBeforeRouteLeave(unwatch);

function onCloseSettingsMenu() {
    konami.reset();
    settings.showDialog = false;
}

onMounted(() => {
    settings.loadOptions();
    window.addEventListener("keydown", konami.recordKeyPress);
});

onUnmounted(() => {
    window.removeEventListener("keydown", konami.recordKeyPress);
});
</script>

<template>
    <ClientOnly>
        <TheMap>
            <template #header>
                <TheHeader />
            </template>
            <MapControls />
            <DetailCardGroup />
            <MapLayers />
            <MapLegend />
            <SettingsDialog :open="konami.didKonami || settings.showDialog" @close="onCloseSettingsMenu" />
        </TheMap>
    </ClientOnly>
</template>
