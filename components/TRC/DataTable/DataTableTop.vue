<script setup lang="ts" generic="Field extends string">
import type { TRCSelectOption } from '../Select.vue';
import type { DataTableColumn } from './data-table-types';

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
  () => [{ value: null, text: "None" } as TRCSelectOption<string>].concat(
    props.columns.map((col) => ({
      value: col.field,
      text: col.headerText
    }))
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
    value: "asc",
    text: "low to high",
  },
  {
    value: "desc",
    text: "high to low",
  },
];

const _sortDirection = computed({
  get() {
    return props.sortDirection;
  },
  set(value) {
    emit("col:sort:direction", { field: _sortBy.value, direction: value });
  }
})

</script>

<template>
  <div class="p-2 flex items-center gap-2 bg-slate-50 relative z-30">
    Sort
    <TRCSelect
      :options="sortByOptions"
      v-model="_sortBy"
    />
    <Transition name="fade">
      <div v-if="_sortBy" class="flex items-center gap-2">
        from
        <TRCSelect
          :options="sortDirectionOptions"
          v-model="_sortDirection"
        />
      </div>
    </Transition>
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