<script
    setup
    lang="ts"
    generic="T extends number | string, O extends TRCSelectOption<T>"
>
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions
} from "@headlessui/vue";

export interface TRCSelectOption<T> {
    value: T;
    text?: string;
    key?: string | number;
}

export interface TRCSelectOptionSlotProps {
    text: string;
    /** Whether or not the option is the active/focused option. */
    active: boolean;
    /** Whether or not the option is the selected option. */
    selected: boolean;
    /** Whether or not the option is the disabled for keyboard navigation and ARIA purposes. */
    disabled: boolean;
}

const props = defineProps<{
    options: O[];
    modelValue: string | number;
    label?: string;
    withCheckmark?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value)
    },
});

const buttonText = computed(() =>
    props.options.find(({ value }) => value === props.modelValue)?.text ?? props.modelValue
);

</script>

<template>
    <div class="w-48">
        <Listbox v-model="model">
            <div class="flex flex-col">
                <ListboxLabel v-if="label" class="px-2 text-xs font-bold text-slate-600">
                    {{ label }}
                </ListboxLabel>
                <ListboxButton class="px-2 py-1 border rounded text-start">
                    <slot name="button">
                        {{ buttonText }}
                    </slot>
                </ListboxButton>
            </div>
            <div class="relative">
                <ListboxOptions class="absolute w-full top-0 p-4 rounded bg-white shadow border space-y-2">
                    <ListboxOption
                        v-for="option in options"
                        :key="option.key ?? option.value"
                        :value="option.value"
                        v-slot="props"
                    >
                        <div
                            class="cursor-pointer flex items-center rounded py-1 px-2 hover:bg-emerald-100"
                            :class="{
                                'bg-emerald-200 hover:bg-emerald-300': props.selected,
                                'bg-emerald-100': props.active && !props.selected,
                            }"
                        >
                            <div v-if="withCheckmark" class="w-7">
                                <IconCheckmark v-if="props.selected" class="h-5" />
                            </div>
                            <div class="flex-1">
                                <slot name="option" v-bind="({ ...option, ...props } as TRCSelectOptionSlotProps)">
                                    {{ option.text ?? option.value }}
                                </slot>
                            </div>
                        </div>
                    </ListboxOption>
                </ListboxOptions>
            </div>
        </Listbox>
    </div>
</template>