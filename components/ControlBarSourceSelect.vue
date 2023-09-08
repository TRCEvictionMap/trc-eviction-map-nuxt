<script setup lang="ts">
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions
} from "@headlessui/vue";
import { useMapControls } from "~/stores/map-controls-store";
import type { SourceId } from "utils/types";

const mapControls = useMapControls();
</script>

<template>
  <Listbox v-model="mapControls.currentSource">
    <ListboxLabel>
        Source
    </ListboxLabel>
    <ListboxButton>{{ mapControls.currentSource }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption
        v-for="source in mapControls.sourceOptions"
        :key="source"
        :value="source"
      >
        {{ source }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>