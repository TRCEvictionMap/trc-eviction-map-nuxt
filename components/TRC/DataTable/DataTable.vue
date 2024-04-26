<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from './data-table-types';
import { useTableColumns } from './use-columns';

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "rows:select": [rowIds: string[]];
  "col:setPin": [payload: { field: string, pinned: boolean }];
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

</script>

<template>
  <div class="overflow-auto">
    <TRCDataTableHeader
      :columns="tableColumns"
      :selectedRows="modelValue"
      :totalRows="rows.length"
      @rows:selectAll="onRowsSelectAll"
      @col:setPin="$emit('col:setPin', $event)"
    />
    <TRCDataTableRow
      v-for="row in rows"
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
