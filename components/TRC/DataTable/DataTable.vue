<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from './data-table-types';
import { useTableColumns } from './use-columns';

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  // sortBy?: [Field, "asc" | "desc"];
  modelValue: string[];
  enableSelectAll?: boolean;
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "rows:select": [rowIds: string[]];
  "col:pin": [payload: { field: string, pinned: boolean }];
  "update:modelValue": [rowIds: string[]];
}>();

const tableColumns = useTableColumns(props.columns);

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    emit("update:modelValue", props.rows.map((row) => row.id));
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

function useSortState() {
  const _directions: ["asc", "desc"] = ["asc", "desc"];
  
  const sortBy = ref<Field>();
  const cursor = ref(-1);

  function handleClick(field: Field) {
    if (sortBy.value !== field) {
      sortBy.value = field;
    }
    if (cursor.value + 1 < _directions.length - 1) {
      cursor.value += 1;
    } else {
      cursor.value = -1;
    }
  }

  const sortDirection = computed(() => _directions[cursor.value]);

  return { sortBy, sortDirection, handleClick }
}

const { sortBy, sortDirection, handleClick } = useSortState();

const sortedRows = computed(() => {
  if (sortBy.value) {
    const field = sortBy.value;
    return Array
      .from(props.rows)
      .sort((a, b) => sortDirection.value === "asc"
        ? a.fields[field].value - b.fields[field].value
        : b.fields[field].value - a.fields[field].value
      );
  }
  return props.rows;
})

</script>

<template>
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
      @col:sort="handleClick"
    />
    <TRCDataTableRow
      v-for="row in sortedRows"
      :key="row.id"
      :data="row"
      :columns="tableColumns"
      :selectedRows="modelValue"
      @row:mouseleave="$emit('row:mouseleave', $event)"
      @row:mouseover="$emit('row:mouseover', $event)"
      @row:select="onRowSelect"
    />
  </div>

</template>

<style>
.dt-cell {
  @apply p-2 flex items-center whitespace-nowrap border;
}
</style>
