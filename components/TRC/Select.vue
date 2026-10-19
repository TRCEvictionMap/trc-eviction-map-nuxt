<script setup lang="ts" generic="T extends number | string | null, O extends TRCSelectOption<T>">
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions
} from "@headlessui/vue";

export interface TRCSelectOption<T> {
	value: T | null;
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
	options: T[] | O[];
	optionsHeader?: string;
	modelValue: T;
	label?: string;
	withCheckmark?: boolean;
  dropUp?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const normalizedOptions = computed(() => props.options.map((option): O => {
  if (
    typeof option === "string" ||
    typeof option === "number"
  ) {
    return { value: option } as O;
  }
  return option as O;
}));

const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

const buttonText = computed(() => {
	const selected = normalizedOptions.value.find(
		(option) => option.value === props.modelValue
	);

	return selected?.text ?? selected?.value ?? "";
});

</script>

<template>
	<Listbox v-model="model" as="div">
		<div class="flex flex-col space-y-1">	
			<ListboxLabel v-if="label" class="px-2 text-xs font-bold text-slate-600">
				{{ label }}
			</ListboxLabel>
			<ListboxButton class="
				px-2 py-1 border rounded text-start whitespace-nowrap text-sm outline-none
			 	focus:ring focus:ring-trc-blue-400 focus:ring-offset-2
			">
				<slot name="button" v-bind="{ buttonText }">
					{{ buttonText }}
				</slot>
			</ListboxButton>
		</div>
		<div class="relative">
			<ListboxOptions
				class="absolute p-4 rounded bg-white shadow border space-y-1 max-h-80 overflow-auto"
				:class="{
					'bottom-8': dropUp,
					'top-[2px]': !dropUp,
				}"
			>
				<ListboxOption v-for="option, i in normalizedOptions" :key="option.key ?? option.value ?? i" :value="option.value"
					v-slot="props">
					<div class="cursor-pointer flex items-center rounded py-1 px-2 hover:bg-trc-blue-100" :class="{
						'bg-trc-blue-200 hover:bg-trc-blue-300': props.selected,
						'bg-trc-blue-100': props.active && !props.selected,
					}">
						<div v-if="withCheckmark" class="w-7">
							<IconCheckmark v-if="props.selected" class="h-5" />
						</div>
						<div class="flex-1 whitespace-nowrap text-sm">
							<slot name="option" v-bind="({ ...option, ...props } as TRCSelectOptionSlotProps)">
								{{ option.text ?? option.value }}
							</slot>
						</div>
					</div>
				</ListboxOption>
			</ListboxOptions>
		</div>
	</Listbox>
</template>