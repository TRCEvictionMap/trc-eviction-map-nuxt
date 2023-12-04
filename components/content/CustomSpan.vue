<script setup lang="ts">
import FootnoteRef from './FootnoteRef.vue';
</script>

<template>
    <FootnoteRef v-if="(typeof $attrs.cid !== 'undefined')" :footnoteId="($attrs.cid as string)" />
    <span v-else>
        <slot></slot>
    </span>
</template>