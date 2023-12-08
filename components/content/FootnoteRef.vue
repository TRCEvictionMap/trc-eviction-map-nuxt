
<script setup lang="ts">
const props = defineProps<{
    footnoteId: string; 
}>();

const footnotes = useFootnotes();

const titleContent = computed(() => {
    const footnoteContent = footnotes.content.value[props.footnoteId];
    if (footnoteContent) {
        const { author, pageTitle } = footnoteContent;
        return `${author}, "${pageTitle}"`;
    }
    return "";
});

const id = footnotes.registerFootnoteRef(props.footnoteId);

const ordering = computed(
    () => footnotes.ordering.value.indexOf(props.footnoteId) + 1
);

</script>

<template>
    <NuxtLink
        class="text-trc-orange-500 !no-underline !-mt-2 !pt-2"
        :id="id"
        :to="{ hash: `#footnote-bottom_${ordering}` }"   
    >
        <sup :title="titleContent">
            [{{ ordering }}]
        </sup>
    </NuxtLink>
</template>