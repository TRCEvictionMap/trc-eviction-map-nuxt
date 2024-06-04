<script setup lang="ts" generic="Field extends string">
import { useMapControls } from "~/stores/map-controls-store";
import type { TRCSelectOption } from "../Select.vue";
import type { DataTableColumn } from "./data-table-types";

const controls = useMapControls();

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  sortBy: Field | null;
  sortDirection: SortDirection;
}>();

const emit = defineEmits<{
  "col:sort:clear": [];
  "col:sort:direction": [{ field: Field | null, direction: SortDirection }];
}>();

const sortByOptions = computed(
  () => [{ value: null, text: "None" } as TRCSelectOption<Field>].concat(
    props
      .columns
      .filter((col) => !col.disableSort)
      .map((col) => ({ value: col.field, text: col.headerText }))
  )
);

const _sortBy = computed({
  get() {
    return props.sortBy;
  },
  set(value) {
    emit("col:sort:direction", {
      field: value ?? null,
      direction: props.sortDirection
    });
  },
});

const sortDirectionOptions: TRCSelectOption<SortDirection>[] = [
  {
    value: "desc",
    text: "high to low",
  },
  {
    value: "asc",
    text: "low to high",
  },
];

const _sortDirection = computed({
  get() {
    return props.sortDirection;
  },
  set(value) {
    emit("col:sort:direction", { field: _sortBy.value, direction: value });
  }
});

</script>

<template>
  <div class="p-2 flex items-center gap-4 relative z-30">
    <div class="flex items-center gap-2">
      Year
      <TRCSelect
        :options="controls.yearOptions"
        v-model="controls.currentYear"
      >
        <template #button="{ buttonText }">
          <span class="font-bold">{{ buttonText }}</span>
        </template>
      </TRCSelect>
    </div>
    <div class="border  h-6"></div>
    <div class="flex items-center gap-2">
      Sort by
      <TRCSelect
        :options="sortByOptions"
        v-model="_sortBy"
      >
        <template #button="{ buttonText }">
          <span class="font-bold">{{ buttonText }}</span>
        </template>
      </TRCSelect>
      <Transition name="fade">
        <div
          v-if="_sortBy"
          class="flex items-center gap-2"
        >
          from
          <TRCSelect
            :options="sortDirectionOptions"
            v-model="_sortDirection"
          >
            <template #button="{ buttonText }">
              <span class="font-bold">{{ buttonText }}</span>
            </template>
          </TRCSelect>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>