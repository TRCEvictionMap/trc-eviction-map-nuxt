<script setup lang="ts">
import type { MarkdownNode, MarkdownRoot } from "@nuxt/content/dist/runtime/types";

const footnoteRefs = ref({});
const footnoteOrdering = ref<string[]>([]);

provide("footnote-refs", footnoteRefs);
provide("footnote-ordering", footnoteOrdering);

useAsyncData(async () => {
    const content = await queryContent("/about").findOne();

    if (content.body) {
        depthFirstCitationIdSearch(content.body)
    }

    function depthFirstCitationIdSearch(node: MarkdownRoot | MarkdownNode) {
        const { cid } = node.props ?? {};

        if (typeof cid === "string" && !footnoteOrdering.value.includes(cid)) {
            footnoteOrdering.value.push(cid);
        }

        node.children?.forEach((child) => depthFirstCitationIdSearch(child));
    } 
});

</script>

<template>
    <div class="absolute top-0 flex flex-col min-h-full w-full">
        <TheHeader />
        <div class="self-center flex-1 p-4 prose sm:prose-lg">
            <ContentDoc />
        </div>
    </div>
</template>