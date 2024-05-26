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

const showDetailCards = computed(() =>
  !disclosures.showDetails &&
  !settings.options.showAlderDistricts &&
  !settings.options.showDataTable
);

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    <ClientOnly>
      <TheMapProvider>
        <template #right>
          <div class="bg-white h-full  ">
            Hello from the right panel
            <div class="flex flex-col gap-2">
              <section v-for="n in 20" :key="n" class="w-full border h-32 rounded bg-slate-100"></section>
            </div>
          </div>
        </template>
        <template #map-overlay>
          <MapLayers />
          <MapLegend position="bottom-right" />
        </template>
        <template #bottom>
          <div>Heller</div>
        </template>
      </TheMapProvider>
    </ClientOnly>
  </div>
</template>