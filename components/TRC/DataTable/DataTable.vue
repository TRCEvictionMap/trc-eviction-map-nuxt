<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from "./data-table-types";
import { useTableColumns } from "./use-columns";

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  modelValue: string[];
  initialRowsPerPage: number;
  enableSelectAll?: boolean;
  maxSelectableRows?: number;
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "rows:select": [rowIds: string[]];
  "col:pin": [payload: { field: string, pinned: boolean }];
  "update:modelValue": [rowIds: string[]];
}>();

const tableColumns = useTableColumns(props.columns);

const {
  setSortState,
  sortBy,
  sortDirection,
  data: sortedRows,
} = useSort<Field, DataTableRow<Field>>(
  props.rows,
  (a, b, sortBy, direction) => direction === "asc"
    ? a.fields[sortBy].value - b.fields[sortBy].value
    : b.fields[sortBy].value - a.fields[sortBy].value
);

const selectedRows = computed(
  () => sortedRows.value.filter((row) => props.modelValue.includes(row.id))
);

const unselectedRows = computed(
  () => sortedRows.value.filter((row) => !props.modelValue.includes(row.id))
);

const pageNumberInput = ref<HTMLInputElement>();

const {
  page,
  pageCount,
  pageSize,
  pageItems,
  isNextPage,
  isPrevPage,
  nextPage,
  prevPage,
} = usePagination({
  page: 0,
  pageSize: 10,
  items: sortedRows
});

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    emit("update:modelValue", pageItems.value.map((row) => row.id));
  } else {
    emit("update:modelValue", []);
  }
}

function onRowSelect(rowId: string) {
  if (props.modelValue.includes(rowId)) {
    emit("update:modelValue", props.modelValue.filter((x) => x !== rowId));
  } else {
    emit("update:modelValue", props.modelValue.concat(rowId));
  }
}

const pageDisplay = computed(() => page.value + 1);

function handlePageNumberInput(ev: Event) {
  try {
    const target = (ev.target as HTMLInputElement);
    const value = Number.parseFloat(target.value);
    if (value > 0 && value <= pageCount.value) {
      page.value = value - 1;
    } else {
      target.value = (page.value + 1).toString();
    }
  } catch (_error) {}
}

</script>

<template>
  <div>
    <div class="overflow-auto">
      <TRCDataTableHeader
        :sortBy="sortBy"
        :sortDirection="sortDirection"
        :columns="tableColumns"
        :selectedRows="modelValue"
        :totalRows="sortedRows.length"
        :enableSelectAll="enableSelectAll"
        @rows:selectAll="onRowsSelectAll"
        @col:pin="$emit('col:pin', $event)"
        @col:sort="setSortState"
      />
      <div role="rowgroup">
        <TRCDataTableRow
          v-for="row in pageItems"
          :key="row.id"
          :data="row"
          :columns="tableColumns"
          :selectedRows="modelValue"
          @row:mouseleave="$emit('row:mouseleave', $event)"
          @row:mouseover="$emit('row:mouseover', $event)"
          @row:select="onRowSelect"
        />
      </div>
    </div>
    <div class="py-2 flex gap-2">
      <button :disabled="!isPrevPage" @click="prevPage" class="button">prev</button>
      <div class="flex items-center gap-2">
        <input
          id="wtf"
          type="number"
          :value="pageDisplay"
          @input="handlePageNumberInput"
          :min="1"
          :max="pageCount"
          class="w-16 p-2"
        >
        <span>of {{ pageCount }}</span>
      </div>
      <button :disabled="!isNextPage" @click="nextPage" class="button">next</button>
    </div>
  </div>

</template>

<style>
.dt-cell {
  @apply p-2 flex items-center whitespace-nowrap border;
}
</style>
