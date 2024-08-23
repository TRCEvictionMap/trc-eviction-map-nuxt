<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";
import { useSettings } from "~/stores/settings-store";

const settings = useSettings();

const map = useSetupMapV2({
  containerId: "map-container",
  navControlPosition: "top-right",
});

provide("map", map);

const resizeActive = ref(false);

const sidePanelWidth = useLocalStorageRef("side-panel-width", 520);
const bottomPanelHeight = useLocalStorageRef("bottom-panel-height", 300);

const mainPanelWidth = computed(() => window.innerWidth - sidePanelWidth.value);

watch(sidePanelWidth, resizeMap);
watch(bottomPanelHeight, resizeMap);
watch(() => settings.options.showBottomPanel, async () => {
  await nextTick();
  resizeMap();
});

function resizeMap() {
  map.value?.resize();
}


const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

</script>

<template>
  <div class="relative flex flex-1" id="main-content">
    <TransitionGroup
      :name="resizeActive ? 'DISABLED_TRANSITION' : 'side-drawer'"
      @afterLeave="resizeMap"
    >
      <div
        v-if="settings.options.showLeftPanel"
        key="right"
        class="relative z-20 bg-white border-r"
        :style="{ width: `${sidePanelWidth}px` }"
      >
        <TRCResize
          :min="300"
          :max="520"
          v-model="sidePanelWidth"
          direction="horizontal"
          position="right"
          @mousedown="resizeActive = true"
          @mouseup="resizeActive = false"
        />
        <div class="flex overflow-auto px-2 py-2 min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)]">
          <slot name="left"></slot>
        </div>
      </div>
      <div
        key="main"
        class="flex flex-col flex-1 max-h-[calc(100vh-60px)]"
        :style="{ width: `${mainPanelWidth}px` }"
      >
        <!-- <TransitionGroup
          :name="resizeActive ? 'DISABLED_TRANSITION' : 'bottom-drawer'"
          @afterLeave="() => onTransitionLeave('bottom-drawer')"
        > -->
        <div
          key="map-content"
          class="relative z-10 flex flex-1"
        >
          <div
            id="map-container"
            class="flex-1"
          ></div>
          <slot name="map-overlay" v-bind="{ isMounted }"></slot>
        </div>
        <div class="relative z-20 border-t bg-white">
          <TRCTooltip
            #="props"
            placement="top"
            :text="`${settings.options.showBottomPanel ? 'Close' : 'Open'} data table.`"
          >
            <button
              v-bind="props"
              class="absolute -top-6 left-1/2 bg-white rounded-tl rounded-tr px-2 py-0 border-t border-l border-r"
              @click="settings.options.showBottomPanel = !settings.options.showBottomPanel"
            >
              <IconChevronUp
                class="transition duration-00"
                :class="{
                  'rotate-180': settings.options.showBottomPanel
                }"
              />

            </button>
          </TRCTooltip>

          <div
            v-if="settings.options.showBottomPanel"
            key="bottom-panel"
            :style="{ height: `${bottomPanelHeight}px` }"
            @mousedown="resizeActive = true"
            @mouseup="resizeActive = false"
          >
            <TRCResize
              :min="300"
              :max="600"
              v-model="bottomPanelHeight"
              direction="vertical"
              position="top"
            />
            <div class="p-4 overflow-auto w-full flex flex-col">
              <slot
                name="bottom"
                v-bind="{ height: bottomPanelHeight }"
              ></slot>
            </div>
          </div>
        </div>
        <!-- </TransitionGroup> -->
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.side-drawer-move,
.side-drawer-enter-active,
.side-drawer-leave-active,
.bottom-drawer-move,
.bottom-drawer-enter-active,
.bottom-drawer-leave-active {
  width: 100%;
  transition: all 75ms ease-in-out;
}

.side-drawer-enter-from,
.side-drawer-leave-to {
  transform: translateX(-100%);
}

.bottom-drawer-enter-from,
.bottom-drawer-leave-to {
  transform: translateY(100vh);
}

.side-drawer-leave-active,
.bottom-drawer-leave-active {
  position: absolute;
}
</style>