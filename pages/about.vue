<script setup lang="ts">

const footnoteRefs = ref({});
const footnoteOrdering = ref([]);

provide("footnote-refs", footnoteRefs);
provide("footnote-ordering", footnoteOrdering);

</script>

<template>
    <div class="absolute top-0 flex flex-col min-h-full w-full">
        <TheHeader />
        <div class="self-center flex-1 p-4 prose sm:prose-lg">
            <ContentDoc />
        </div>
    </div>
</template>