<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useFeatureState } from "~/stores/feature-state-store";

const { baseSourceId } = useCurrentSourceIds();

const featureState = useFeatureState();
const featureProperties = useFeatureProperties();

const selected = computed({
    get() {
        return featureState.selectedFeatures.map(
            (featureId) => {
                const feature = featureProperties.data[baseSourceId].find((feature) => feature.id === featureId)
                if (feature) {
                    const { geog_name, id } = feature;
                    return { geog_name, id };
                }
                return { geog_name: "", id: "" };
            }
        );
    },
    set(value: { geog_name: string; id: string; }[]) {
        value.map(({ id }) => featureState.setFeatureState(
            id,
            "isSelected",
            true
        ));
    }
});

const options = computed(
    () => featureProperties.data[baseSourceId].map(
        ({ id, geog_name }) => ({
            id,
            geog_name
        })
    )
);
</script>

<template>
    <Combobox v-model="selected" multiple class="relative" as="div">
        <ul v-if="selected.length > 0">
            <li v-for="item in selected" :key="item.id">
                {{ item.geog_name }}
            </li>
        </ul>
        <ComboboxInput />
        <ComboboxOptions class="absolute shadow bg-white p-4 overflow-auto h-72">
            <ComboboxOption v-for="option in options" :key="option.id" :value="option">
                {{ option.geog_name }}
            </ComboboxOption>
        </ComboboxOptions>
    </Combobox>
</template>