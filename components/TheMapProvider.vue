<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";
import { useSettings } from "~/stores/settings-store";

const settings = useSettings();

const map = useSetupMap({
  containerId: "map-container",
  navControlPosition: "top-right",
});

provide("map", map);

const resizeActive = ref(false);

const sidePanelWidth = useLocalStorageRef("side-panel-width", 400);
const bottomPanelHeight = useLocalStorageRef("bottom-panel-height", 400);

const mainPanelWidth = computed(() => window.innerWidth - sidePanelWidth.value);

watch(sidePanelWidth, resizeMap);
watch(bottomPanelHeight, resizeMap);

function resizeMap() {
  map.value?.resize();
}

</script>

<template>
  <div class="relative flex flex-1">
    <TransitionGroup :name="resizeActive ? 'disabled-transition' : 'side-drawer'" @afterLeave="resizeMap">
      <div
        v-if="settings.options.showLeftPanel"
        key="right"
        class="relative z-20 bg-white border-r"
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
        :style="{ width: `${mainPanelWidth}px` }"
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
          class="relative z-20 border-t bg-white"
          :style="{ height: `${bottomPanelHeight}px` }"
        >
          <TRCResize
            :min="300"
            :max="600"
            v-model="bottomPanelHeight"
            direction="vertical"
            position="top"
          />
          <div class="p-4 overflow-auto w-full flex flex-col">

            <slot name="bottom" v-bind="{ height: bottomPanelHeight }"></slot>
          </div>
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