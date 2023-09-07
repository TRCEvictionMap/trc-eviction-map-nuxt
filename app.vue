<script setup lang="ts">
import { DataSource } from 'utils/types';


const router = useRouter();
const route = useRoute();

const map = ref<mapboxgl.Map>();

provide("map", map);

function toggleLayers() {
    router.replace({
        query: {
            source: route.query.source === "alder-districts" ? undefined : "alder-districts",
        },
    });
}

const sources: DataSource[] = [
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
