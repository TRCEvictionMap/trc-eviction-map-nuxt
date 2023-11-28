
<script setup lang="ts">
const props = defineProps<{
    number: number;
}>();

const footnotes = useFootnotes();

const id = footnotes.registerInlineFootnote(props.number);

</script>

<template>
    <NuxtLink class="text-trc-orange-500 !no-underline" :id="id" :to="{ hash: `#footnote-bottom_${number}` }">
        <sup>
            [{{ number }}]
        </sup> 
    </NuxtLink>
</template>