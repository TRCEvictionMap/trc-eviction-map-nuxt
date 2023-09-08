<script setup lang="ts">
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions
} from "@headlessui/vue";
import type { SourceId } from "utils/types";

const sources: SourceId[] = [
    "alder-districts",
];

</script>

<template>
  <Listbox v-model="$route.query.source">
    <ListboxLabel>
        Source
    </ListboxLabel>
    <ListboxButton>{{ $route.query.source }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption
        v-for="source in sources"
        :key="source"
        :value="source"
      >
        {{ source }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>