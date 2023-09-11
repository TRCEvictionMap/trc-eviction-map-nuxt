<script setup lang="ts">
defineProps<{
    featureId: string;
}>();
</script>

<template>
    <div class="bg-white p-4 h-56 border shadow-xl rounded">
        {{ featureId }}
    </div>
</template>