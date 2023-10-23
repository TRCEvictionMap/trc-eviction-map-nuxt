<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

defineProps<{
    label?: string;
    modelValue?: string | number;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="w-48">
        <label v-if="label" :for="($attrs.id as string)">{{ label }}</label>
        <input v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue')">
    </div>
</template>