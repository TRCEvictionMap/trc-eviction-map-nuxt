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
const bottomPanelHeight = useLocalStorageRef("bottom-panel-height", 400);

</script>

<template>
  <div class="flex flex-1">
    <TransitionGroup name="side-drawer">
      <div
        v-if="settings.options.showDataTable"
        key="right"
        class="relative z-20 bg-white border-r max-h-[calc(100vh-60px)] p-4 overflow-auto"
      >
        <slot name="right"></slot>
      </div>
      <div class="flex flex-col flex-1 max-h-[calc(100vh-60px)]" key="main">
        <div class="relative z-10 flex flex-1 ">
          <div id="map-container" class="flex-1"></div>
          <slot name="map-overlay"></slot>
        </div>
        <div class="relative z-20 p-2 border-t">
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
  transition: transform 75ms ease-in-out;
}

.side-drawer-enter-from,
.side-drawer-leave-to {
  transform: translateX(-100%);
}

.side-drawer-leave-active {
  position: absolute;
}
</style>