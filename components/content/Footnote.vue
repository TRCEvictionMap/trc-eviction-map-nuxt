<script setup lang="ts">
const props = defineProps<{
    number: number;
    author: string;
    pageTitle: string;
    pageUrl: string;
    year?: number;
}>();

const id = `footnote-bottom_${props.number}`;

const footnotes = useFootnotes();

const route = useRoute();

const className = ref({});

watch(() => route.hash, (hash) => {
    className.value = {
        "bg-trc-orange-100": hash.slice(1) === id
    }
});

onMounted(() => {
    className.value = {
        "bg-trc-orange-100": route.hash.slice(1) === id
    }
});

</script>

<template>
    <li :id="id" class="mb-6" :class="className">
        <cite>
            {{ author }}, &quot;{{ pageTitle }}&quot; {{ year ? year + "," : undefined }}
            <NuxtLink :to="pageUrl" target="_blank">
                {{ pageUrl }}
            </NuxtLink>
        </cite>
        <div v-if="footnotes.instances.value[number]" class="flex items-center space-x-2">
            <template v-if="footnotes.instances.value[number].length > 1">
                ^
                <ul class="flex p-0 m-0 list-none">
                    <li class="m-0" v-for="instance in footnotes.instances.value[number]">
                        <NuxtLink class="text-trc-orange-500 no-underline" :to="{ hash: `#${instance.backlink}`}">
                            {{ instance.letter }}
                        </NuxtLink>
                    </li>
                </ul>
            </template>
            <NuxtLink
                v-else
                class="text-trc-orange-500 !no-underline"
                :to="{ hash: `#${footnotes.instances.value[number][0].backlink}`}"
                title="Jump up"
            >
                ^
            </NuxtLink>
        </div>
    </li>
</template>

