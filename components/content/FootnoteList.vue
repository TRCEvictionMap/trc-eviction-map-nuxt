<script setup lang="ts">
import type { FootnoteListItemProps } from './FootnoteListItem.vue';

const props = defineProps<{
    items: FootnoteListItemProps[];
}>();

const footnotes = useFootnotes();

const sortedItems = computed(() =>
    Array
        .from(props.items)
        .sort((a, b) =>
            footnotes.ordering.value.indexOf(a.id) - footnotes.ordering.value.indexOf(b.id)
        )
);

</script>

<template>
    <ol>
        <FootnoteListItem v-for="item in sortedItems" v-bind="item" />
    </ol>
</template>