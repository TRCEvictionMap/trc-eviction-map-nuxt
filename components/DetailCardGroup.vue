<script setup lang="ts">
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();
</script>

<template>
    <div class="absolute top-0 flex items-center min-h-screen">
        <div class="absolute flex space-x-2">
            <DetailCard v-for="featureId in selectedFeatures.items" :key="featureId" :featureId="featureId" />
        </div>
    </div>
</template>