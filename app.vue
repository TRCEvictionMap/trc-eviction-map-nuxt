<script setup lang="ts">
import { SourceId } from 'utils/types';


const router = useRouter();
const route = useRoute();

const map = ref<mapboxgl.Map>();

provide("map", map);

const sources: SourceId[] = [
    "alder-districts",
];

onMounted(() => {
    const { source, features } = route.query;

    if (!source) {
        router.replace({
            query: {
                source: "alder-districts",
            },
        });
    }
});

</script>

<template>
    <TheMap>
        <ControlBar />
        <ClientOnly>
            <template v-for="source in sources">
                <MapLayer v-if="$route.query.source === source" :source="source" />
            </template>
        </ClientOnly>
    </TheMap>
</template>
