<script setup lang="ts">
import type { FootnoteListItemProps } from './FootnoteListItem.vue';

const props = defineProps<{
    items: FootnoteListItemProps[];
}>();

const footnotes = useFootnotes();

const sortedItems = computed(() => {
    const ordering = footnotes.ordering.value.concat(
        props.items
            .map((item) => item.id)
            .filter((id) => !footnotes.ordering.value.includes(id))
    );

    const items = Array.from(props.items);

    items.sort((a, b) => ordering.indexOf(a.id) - ordering.indexOf(b.id));

    return items;
});

</script>

<template>
    <ol>
        <FootnoteListItem v-for="(item, i) in sortedItems" :key="i" v-bind="item" />
    </ol>
</template>