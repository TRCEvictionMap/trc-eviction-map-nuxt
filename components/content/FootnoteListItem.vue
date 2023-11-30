<script setup lang="ts">

export interface FootnoteListItemProps {
    id: string;
    author: string;
    pageTitle: string;
    pageUrl: string;
    year?: string;
}

const props = defineProps<FootnoteListItemProps>();
// const props = defineProps<{
//     number: string;
//     id: string;
//     author: string;
//     pageTitle: string;
//     pageUrl: string;
//     year?: number;
// }>();

// const id = `footnote-bottom_${props.number}`;

const footnotes = useFootnotes();

const anchorId = computed(
    () => `footnote-bottom_${footnotes.ordering.value.indexOf(props.id) + 1}`
);

const route = useRoute();

const className = ref({});

// const number = Number.parseInt(props.number);

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
    <li :id="anchorId" class="mb-6" :class="className">
        <cite>
            {{ author }}, &quot;{{ pageTitle }}&quot; {{ year ? year + "," : undefined }}
            <NuxtLink :to="pageUrl" target="_blank">
                {{ pageUrl }}
            </NuxtLink>
        </cite>
        <div v-if="footnotes.references.value[id]" class="flex items-center space-x-2">
            <template v-if="footnotes.references.value[id].length > 1">
                ^
                <ul class="flex p-0 m-0 list-none">
                    <li class="m-0" v-for="reference in footnotes.references.value[id]">
                        <NuxtLink class="text-trc-orange-500 no-underline" :to="{ hash: `#${reference.backlink}`}">
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
    </li>
</template>

