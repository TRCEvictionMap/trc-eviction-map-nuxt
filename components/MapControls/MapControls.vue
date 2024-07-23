<script setup lang="ts">
// import { TabGroup, TabList, Tab, TabPanels } from "@headlessui/vue";
import MapControlsDateRangePanel from './MapControlsDateRangePanel.vue';
import MapControlsLayersPanel from './MapControlsLayersPanel.vue';

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const panels = [
  {
    id: "layers",
    name: "Layers",
    component: markRaw(MapControlsLayersPanel),
  },
  {
    id: "date-range",
    name: "Date Range",
    component: markRaw(MapControlsDateRangePanel),
  },
] as const;

type PanelId = typeof panels[number]["id"];
const activePanel = ref<PanelId>();

type Comp = typeof panels[number]["component"];
const activeComponent = ref<Comp>();

watch(activePanel, (current, previous) => {
  console.log({ current, previous });
});

</script>

<template>
  <div
    class="
      hidden z-10 
      sm:flex sm:w-auto
      sm:justify-center 
    "
    :class="{
      'relative': !isFloating,
      'absolute top-0 sm:top-2': isFloating,
      'sm:self-start sm:ml-2': isFloating && position === 'left',
      'sm:self-center': isFloating && position === 'center',
    }"
  >
    <div
      class="
        flex flex-col justify-center items-start flex-shrink-0 w-full
        p-4 gap-y-4
        rounded flex-1 max-w-[490px]
        bg-white border
      "
      :class="{
        'shadow-2xl': isFloating
      }"
    >
      <div @mouseleave="activeComponent = undefined">
        <div class="tab-list">
          <div
            v-for="panel in panels"
            :key="panel.id"
            class="tab-list__tab"
            @mouseenter="activeComponent = panel.component"
          >
            {{ panel.name }}
          </div>
        </div>
        <div class="tab-panels">
          <Transition name="fade" mode="default">
            <Component :is="activeComponent" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  @apply flex;
}

.tab-list__tab:not(:first-child) {
  @apply pl-3
}

.tab-list__tab:not(:last-child) {
  @apply pr-3
}

.tab-panels {
  @apply flex relative;
}

.tab-panels__panel {
  @apply py-4
}

/* .fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px), scaleY(80%);
  opacity: 0;
} */

/* .fade-move, */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(20px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>