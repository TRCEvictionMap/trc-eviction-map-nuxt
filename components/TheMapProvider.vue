<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";
import { useSettings } from "~/stores/settings-store";

const settings = useSettings();

const map = useSetupMap({
  containerId: "map-container",
  navControlPosition: "top-right",
});

provide("map", map);

const sidePanelWidth = useLocalStorageRef("side-panel-width", 400);
const resizeActive = ref(false);

const bottomPanelHeight = useLocalStorageRef("bottom-panel-height", 400);

watch(sidePanelWidth, resizeMap);

function resizeMap() {
  map.value?.resize();
}

</script>

<template>
  <div class="relative flex flex-1">
    <TransitionGroup :name="resizeActive ? 'disabled-transition' : 'side-drawer'" @afterLeave="resizeMap">
      <div
        v-if="settings.options.showDataTable"
        key="right"
        class="relative z-20 bg-white border-r  "
        :style="{ width: `${sidePanelWidth}px` }"
      >
        <TRCResize
          :min="300"
          :max="800"
          v-model="sidePanelWidth"
          direction="horizontal"
          position="right"
          @mousedown="resizeActive = true"
          @mouseup="resizeActive = false"
        />
        <div class="p-4 overflow-auto max-h-[calc(100vh-60px)]">
          <slot name="right"></slot>
        </div>
      </div>
      <div
        key="main"
        class="flex flex-col flex-1 max-h-[calc(100vh-60px)]"
      >
        <div
          key="map-content"
          class="relative z-10 flex flex-1"
        >
          <div
            id="map-container"
            class="flex-1"
          ></div>
          <slot name="map-overlay"></slot>
        </div>
        <div
          v-if="settings.options.showBottomPanel"
          key="bottom-panel"
          class="relative z-20 p-2 border-t bg-white w-full"
          :style="{ height: `${bottomPanelHeight}px` }"
        >
          <TRCResize
            :min="300"
            :max="600"
            v-model="bottomPanelHeight"
            direction="vertical"
            position="top"
          />
          <slot name="bottom"></slot>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.side-drawer-move,
.side-drawer-enter-active,
.side-drawer-leave-active {
  transition: all 75ms ease-in-out;
}

.side-drawer-enter-from,
.side-drawer-leave-to {
  transform: translateX(-100%);
}

.side-drawer-leave-active {
  position: absolute;
}
</style>