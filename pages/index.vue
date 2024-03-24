<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

import { Disclosure } from "@headlessui/vue";

import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";

import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";
import { useDisclosures } from "~/stores/disclosures-store";
import WelcomeModal from "~/components/WelcomeModal/WelcomeModal.vue";

useHead({
    title: "Eviction Map - Tenant Resource Center"
});

const router = useRouter();
const mapControls = useMapControls();
const mapMeta = useMapMeta();
const featureState = useFeatureState();
const settings = useSettings();
const disclosures = useDisclosures();

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

await useAsyncData(
  "welcome-modal-content",
  () => queryContent("/welcome-modal-content").findOne()
);


</script>

<template>
    <div class="absolute top-0 w-full h-full flex flex-col">
        <TheHeader />

        <ClientOnly>
            <Disclosure :defaultOpen="disclosures.showDetails">
                <TheMap>
                    <MapControls />
                    <MapLayers />
                    <MapLegend v-if="!disclosures.showDetails" />
                    <DetailCardGroup v-if="!disclosures.showDetails" />
                    <SettingsDialog :open="konami.didKonami || settings.showDialog" @close="onCloseSettingsMenu" />
                </TheMap>
                <Transition name="details-drawer">
                    <DetailDisclosurePanel static v-if="disclosures.showDetails" />
                </Transition>
            </Disclosure>
            <WelcomeModal />
        </ClientOnly>
    </div>
</template>

<style scoped>
.details-drawer-enter-active {
    animation: details-drawer-open 0.1s;
}

.details-drawer-leave-active {
    animation: details-drawer-open 0.1s reverse;
}

@keyframes details-drawer-open {
    from {
        height: 0;
    }
    to {
        height: 50%;
    }
}
</style>