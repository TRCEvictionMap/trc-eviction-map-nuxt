<script setup lang="ts">

import type { MarkdownNode, MarkdownRoot } from "@nuxt/content/dist/runtime/types";
import type { FootnoteListItemProps } from "~/components/content/FootnoteListItem.vue";

const footnoteRefs = ref({});
const footnoteContent = ref<Record<string, FootnoteListItemProps>>({});
const footnoteOrdering = ref<string[]>([]);

provide("footnote-refs", footnoteRefs);
provide("footnote-content", footnoteContent);
provide("footnote-ordering", footnoteOrdering);

useAsyncData(async () => {
    const content = await queryContent("/about").findOne();

    if (content.body) {
        parseFootnoteContent(content.body)
    }

    function parseFootnoteContent(node: MarkdownRoot | MarkdownNode) {
        const { cid } = node.props ?? {};

        if (
            isMarkdownNode(node) &&
            node.tag === "FootnoteList" &&
            node.props
        ) {
            const items = JSON.parse(node.props[":items"]) as FootnoteListItemProps[];

            items.forEach((item) => {
                footnoteContent.value[item.id] = item;
            });
        }

        if (typeof cid === "string" && !footnoteOrdering.value.includes(cid)) {
            footnoteOrdering.value.push(cid);
        }

        node.children?.forEach((child) => parseFootnoteContent(child));
    } 
});

function isMarkdownNode(node: MarkdownRoot | MarkdownNode): node is MarkdownNode {
    return typeof (node as any).tag === "string";
}

</script>

<template>
    <div class="absolute top-0 flex flex-col min-h-full w-full">
        <TheHeader />
        <div class="self-center flex-1 w-full p-4 prose sm:prose-lg">
            <ContentDoc />
        </div>
    </div>
</template>