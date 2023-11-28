<script setup lang="ts">
import FootnoteRef from './FootnoteRef.vue';
</script>

<template>
    <FootnoteRef v-if="typeof $attrs.citeref !== 'undefined'" :number="($attrs.citeref as number)" />
    <span v-else>
        <slot></slot>
    </span>
</template>