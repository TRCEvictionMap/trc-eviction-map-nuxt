<script setup lang="ts">

defineOptions({ inheritAttrs: false });

const props = defineProps({
  href: {
    type: String,
    default: ""
  },
  target: {
    type: String,
    default: undefined,
    required: false
  }
});

const attrs = useAttrs();

const target = props.target || props.href.startsWith("http") ? "_blank" : undefined;
const rel = target === "_blank" ? "noopener noreferrer" : attrs.rel as string;

</script>

<template>
  <NuxtLink
    :href="href"
    :target="target"
    :rel="rel"
    :class="{
      'text-trc-orange-500 font-normal': href.startsWith('http'),
    }"
  >
    <slot />
  </NuxtLink>
</template>