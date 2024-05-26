<template>
  <Transition name="drawer">
    <slot></slot>
  </Transition>
</template>

<style>
.drawer-enter-from,
.drawer-leave-to {
  @apply -translate-x-full;
}

.drawer-enter-to,
.drawer-leave-from {
  @apply translate-x-0;
}

.drawer-enter-active,
.drawer-leave-active {
  @apply transition-transform duration-100 ease-in-out;
}
</style>