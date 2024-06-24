<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

import { Disclosure } from "@headlessui/vue";

import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";

import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";
import { useDisclosures } from "~/stores/disclosures-store";
import WelcomeModal from "~/components/WelcomeModal/WelcomeModal.vue";
import { useFeatureFlags } from "~/stores/feature-flags";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

useHead({
  title: "Eviction Map - Tenant Resource Center"
});

const router = useRouter();
const mapControls = useMapControlsV2();
const mapMeta = useMapMeta();
const featureState = useFeatureState();
const settings = useSettings();
const disclosures = useDisclosures();

const konami = useKonamiCode();

const unwatch = watchEffect(() => {
  router.replace({
    query: {
      dates: (mapControls.currentMonthRange ?? []).join(","),
      source: mapControls.currentSource,
      year: mapControls.currentYear,
      d_metric: mapControls.currentChoroplethMetric,
      zoom: mapMeta.zoom,
      center: mapMeta.lngLat
        ? mapMeta.lngLat.join(",")
        : undefined,
      features: featureState.selectedFeatures.length
        ? featureState.selectedFeatures.join(",")
        : undefined,
      showDetails: disclosures.showDetails ? "t" : "f",
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
  <div class="absolute w-full min-h-screen flex flex-col">
    <TheHeader />
    <ClientOnly>
      <TheMapProviderV2 v-if="true">
        <template #left>
          <LeftPanelContent />
        </template>
        <template #map-overlay>
          <MapLayers />
          <MapControlsV2 v-if="!settings.options.showLeftPanel" isFloating position="left" />
          <MapLegendV2 position="bottom-right" />
        </template>
        <template #bottom="{ height }">
          <FeaturesTableV2 :style="{ height: `${height - 30}px` }" />
        </template>
      </TheMapProviderV2>
      <TheMapProvider v-else>
        <template #right>
          <div class="space-y-4">
            <TransitionGroup name="features">
              <FeatureDetailV2 v-for="featureId in featureState.selectedFeatures" :key="featureId" :featureId="featureId" />
            </TransitionGroup>
          </div>
        </template>
        <template #map-overlay>
          <MapLayers />
          <MapControls position="left" />
          <MapLegend position="bottom-right" />
        </template>
        <template #bottom="{ height }">
          <FeaturesTable :style="{ height: `${height - 30}px` }" />
        </template>
      </TheMapProvider>
      <WelcomeModal />
    </ClientOnly>
  </div>
</template>

