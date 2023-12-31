<script setup lang="ts">

export interface FootnoteListItemProps {
    id: string;
    author: string;
    pageTitle: string;
    pageUrl: string;
    year?: string;
}

const props = defineProps<FootnoteListItemProps>();

const footnotes = useFootnotes();

const anchorId = computed(
    () => `footnote-bottom_${footnotes.ordering.value.indexOf(props.id) + 1}`
);

const route = useRoute();

const className = ref({});

watch(() => route.hash, (hash) => {
    className.value = {
        "bg-trc-orange-100": hash.slice(1) === anchorId.value
    }
});

onMounted(() => {
    className.value = {
        "bg-trc-orange-100": route.hash.slice(1) === anchorId.value
    }
});

</script>

<template>
    <li :id="anchorId" class="break-words !-mt-3 !pt-3" >
        <div :class="className" class="py-1 px-2">
            <cite>
                {{ author }}, &quot;{{ pageTitle }}&quot; {{ year ? year + "," : undefined }}
                <NuxtLink :href="pageUrl" target="_blank">
                    {{ pageUrl }}
                </NuxtLink>
            </cite>
            <div v-if="footnotes.references.value[id]" class="flex items-center space-x-2">
                <template v-if="footnotes.references.value[id].length > 1">
                    ^
                    <ul class="flex !p-0 !m-0 list-none">
                        <li class="!m-0" v-for="reference in footnotes.references.value[id]">
                            <NuxtLink
                                title="Jump up"
                                class="text-trc-orange-500 no-underline"
                                :to="{ hash: `#${reference.backlink}`}"
                            >
                                {{ reference.letter }}
                            </NuxtLink>
                        </li>
                    </ul>
                </template>
                <NuxtLink
                    v-else
                    class="text-trc-orange-500 !no-underline"
                    :to="{ hash: `#${footnotes.references.value[id][0].backlink}`}"
                    title="Jump up"
                >
                    ^
                </NuxtLink>
            </div>
        </div>
    </li>
</template>

