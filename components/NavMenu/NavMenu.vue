<script setup lang="ts">
import { useTriggers } from './use-triggers';

defineProps<{ width: number | string }>();

const { activeMenu, contentTransition, setFocus } = useTriggers();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

</script>

<template>
  <Teleport
    to="#main-content"
    v-if="isMounted"
  >
    <div @mouseleave="activeMenu = undefined">
      <div
        class="absolute z-30 top-2 left-2 bg-white p-4 border"
        :class="{
          'rounded': !activeMenu,
          'rounded-tr rounded-tl border border-b-transparent': activeMenu
        }"
      >
        <div class="flex gap-6" :style="{ width: `${width}px` }">
          <slot name="header-left"></slot>
          <div class="flex-1">
            <div class="flex gap-6" tabindex="0" @focus="setFocus">
              <slot name="header-center"></slot>
            </div>
          </div>
          <slot name="header-right"></slot>
        </div>
      </div>
      <Transition name="wrapper">
        <div
          v-if="activeMenu"
          class="
            absolute z-20 top-16 left-2 flex p-4 bg-white border
            rounded-tr rounded-bl rounded-br
          "
        >
          <Transition :name="contentTransition">
            <div :key="activeMenu" class="flex-1 flex">
              <slot
                name="content"
                v-bind="{ activeMenu }"
              ></slot>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.content-slide-right-enter-active,
.content-slide-right-leave-active,
.content-slide-left-enter-active,
.content-slide-left-leave-active,
.content-slide-down-enter-active,
.content-slide-down-leave-active,
.wrapper-enter-active,
.wrapper-leave-active {
  transition: all .1s ease-in-out;
}

.wrapper-enter-from,
.wrapper-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.content-slide-right-enter-from,
.content-slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.content-slide-left-enter-from,
.content-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.content-slide-down-enter-from,
.content-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.content-slide-down-leave-active,
.content-slide-right-leave-active,
.content-slide-left-leave-active {
  position: absolute;
}
</style>