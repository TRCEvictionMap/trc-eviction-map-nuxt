<script setup lang="ts">
// import { TabGroup, TabList, Tab, TabPanels } from "@headlessui/vue";
import MapControlsDateRange from './MapControlsDateRange.vue';
import MapControlsLayers from './MapControlsLayers.vue';

defineProps<{
  position: "center" | "left";
  isFloating?: boolean;
}>();

const panels = [
  {
    id: "layers",
    name: "Layers",
    component: markRaw(MapControlsLayers),
  },
  {
    id: "date-range",
    name: "Date Range",
    component: markRaw(MapControlsDateRange),
  },
] as const;

type Comp = typeof panels[number]["component"];
const activeComponent = ref<Comp>();
const activeIndex = ref(-1);

const transition = ref<"fade-in" | "fade-out" | "fade-right" | "fade-left">("fade-in");

watch(activeIndex, async (current, previous) => {
  if (
    previous < 0 ||
    (previous > -1 && current < 0)
  ) {
    transition.value = "fade-in";
  } else if (current > previous) {
    transition.value = "fade-right";
  } else {
    transition.value = "fade-left";
  }
  activeComponent.value = panels[current]?.component;
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
      @mouseleave="activeIndex = -1"
    >
      <div class="w-full relative">
        <ul class="tab-list">
          <li
            v-for="panel, i in panels"
            :key="panel.id"
            class="tab-list__tab"
          >
            <button
              class="tab-list__tab-button"
              :class="{
                'ring': activeIndex === i,
              }"
              @mouseenter="activeIndex = i"
              @focus="activeIndex = i"
            >
              {{ panel.name }}
            </button>
          </li>
        </ul>
        <Transition name="card">
          <div class="tab-panels absolute border" v-if="activeComponent">
            <!-- <Transition :name="transition"> -->
              <Component :is="activeComponent" class="w-[490px] pt-4" />
            <!-- </Transition> -->
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-list {
  @apply flex;
}

.tab-list__tab-button {
  @apply rounded px-2 py-1;
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

/* .fade-in-move, */
.fade-left-move,
.fade-right-move,
.fade-in-enter-active,
/* .fade-out-enter-active, */
.fade-left-enter-active,
.fade-right-enter-active,
.fade-in-leave-active,
/* .fade-out-leave-active, */
.fade-left-leave-active, 
.fade-right-leave-active {
  transition: all .5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-in-enter-from,
/* .fade-out-enter-from, */
.fade-left-enter-from,
.fade-right-enter-from,
.fade-in-leave-to,
/* .fade-out-leave-to, */
.fade-left-leave-to,
.fade-right-leave-to {
  opacity: 0;
}

.fade-in-enter-from,
.fade-in-leave-to {
  transform: translateY(-10px);
  /* transform: translateY(-10px) scaleY(0); */
}


/* .fade-out-enter-from,
.fade-out-leave-to {
  transform: translateY(10px);
} */

.fade-left-enter-from,
.fade-left-leave-to {
  transform: translateX(-20px);
  /* transform: translateX(-20px) scaleX(0); */
}

.fade-right-enter-from,
.fade-right-leave-to {
  transform: translateX(20px);
  /* transform: translateX(20px) scaleX(0); */
}

.fade-in-leave-active,
/* .fade-out-leave-active, */
.fade-left-leave-active,
.fade-right-leave-active {
  /* display: none; */
  position: absolute;
}


.card-enter-active {
  transition: all 0.3s ease-out;
}

.card-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.card-enter-from,
.card-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>