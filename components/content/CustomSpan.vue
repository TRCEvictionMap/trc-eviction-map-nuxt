<script setup lang="ts">
import FootnoteRef from './FootnoteRef.vue';
</script>

<template>
    <FootnoteRef v-if="typeof $attrs.citeref !== 'undefined'"  :footnoteId="($attrs.citeref as string)" />
    <span v-else>
        <slot></slot>
    </span>
</template>