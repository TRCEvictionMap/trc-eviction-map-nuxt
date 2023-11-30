
<script setup lang="ts">
const props = defineProps<{
    footnoteId: string; 
}>();

const footnotes = useFootnotes();

const id = footnotes.registerFootnoteRef(props.footnoteId);

const ordering = computed(
    () => footnotes.ordering.value.indexOf(props.footnoteId) + 1
);

</script>

<template>
    <NuxtLink
        class="text-trc-orange-500 !no-underline"
        :id="id"
        :to="{ hash: `#footnote-bottom_${ordering}` }"
    >
        <sup>
            [{{ ordering }}]
        </sup> 
    </NuxtLink>
</template>