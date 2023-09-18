<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>

<template>
    <div>
        <div class="text-sm text-slate-500">
            {{ label }}
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>