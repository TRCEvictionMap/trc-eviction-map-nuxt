<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

// const model = defineModel<string | number>();

defineProps<{
    label?: string;
    modelValue?: string | number;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="flex flex-col">
        <label v-if="label" :for="($attrs.id as string)">{{ label }}</label>
        <input v-bind="$attrs" :value="modelValue" @input="ev => $emit('update:modelValue', (ev.target as HTMLInputElement).value)">
    </div>
</template>