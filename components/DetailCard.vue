<script setup lang="ts">
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();

defineProps<{
    featureId: string;
}>();
</script>

<template>
    <div class="relative bg-white p-4 h-56 w-40 border shadow-xl rounded">
        <TRCButton class="absolute top-1 right-1" @click="() => selectedFeatures.deselect(featureId)">
            <IconXMark class="text-slate-500" />
        </TRCButton>
        {{ featureId }}
    </div>
</template>