<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import { nextTick } from "#imports";
import { Disclosure } from "@headlessui/vue";

import { useMapMeta } from "~/stores/map-meta-store";
import { useMapControls } from "~/stores/map-controls-store";

import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";
import { useDisclosures } from "~/stores/disclosures-store";
import WelcomeModal from "~/components/WelcomeModal/WelcomeModal.vue";
import { useFeatureFlags } from "~/stores/feature-flags";
import type mapboxgl from "mapbox-gl";

useHead({
  title: "Eviction Map - Tenant Resource Center"
});

const router = useRouter();
const mapControls = useMapControls();
const mapMeta = useMapMeta();
const featureState = useFeatureState();
const settings = useSettings();
const disclosures = useDisclosures();
const flags = useFeatureFlags();

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

// function onEnter(el: Element, done: () => void) {
//   const panelWidth = unref(useLocalStorageRef(
//     "table-panel-width",
//     window.innerWidth / 2
//   ));

//   animate({
//     done,
//     duration: 200,
//     start: 0,
//     dest: panelWidth,
//     callback(value) {
//       (el as HTMLElement).style.width = `${value}px`;
//     }
//   });
// }

// function onLeave(el: Element, done: () => void) {
//   const panelWidth = unref(useLocalStorageRef(
//     "table-panel-width",
//     window.innerWidth / 2
//   ));

//   animate({
//     done,
//     duration: 200,
//     start: panelWidth,
//     dest: 0,
//     callback(value) {
//       (el as HTMLElement).style.width = `${value}px`;
//     }
//   });
// }

// interface AnimateOptions {
//   duration: number;
//   done: () => void;
//   callback: (easedValue: number) => void;
//   start: number;
//   dest: number;
// }

// function animate(options: AnimateOptions) {
//   const { duration, done, callback, start, dest } = options;
//   const startTime = Date.now();
//   const endTime = startTime + duration;

//   let easedValue = start;

//   function doAnimation() {
//     const currentTime = Date.now();

//     if (currentTime > endTime) {
//       callback(easedValue);
//       return done();
//     }

//     const progress = currentTime - startTime;

//     easedValue = easeInOutExpo(
//       progress,
//       start,
//       dest - start,
//       duration
//     );
    
//     callback(easedValue);

//     window.requestAnimationFrame(doAnimation);
//   }

//   doAnimation();
// }

</script>

<template>
  <div class="absolute top-0 w-full h-full flex flex-col">
    <TheHeader />
    <ClientOnly>
      <Disclosure :defaultOpen="disclosures.showDetails">
        <TheMap>
          <template #right>
            <FeaturesTableDrawer />
          </template>
          <MapControls :position="settings.options.showDataTable ? 'left' : 'center' " />
          <MapLayers />
          <MapLegend v-if="!disclosures.showDetails" />
          <DetailCardGroup v-if="showDetailCards" />
        </TheMap>
        <Transition name="details-drawer">
          <DetailDisclosurePanel static v-if="disclosures.showDetails" />
        </Transition>
      </Disclosure>
      <WelcomeModal />
      <SettingsDialog
        :open="konami.didKonami || settings.showDialog"
        @close="onCloseSettingsMenu"
      />
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