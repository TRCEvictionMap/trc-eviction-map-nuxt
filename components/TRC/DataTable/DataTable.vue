<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from './data-table-types';

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "col:setPin": [payload: { field: string, pinned: boolean }];
  "update:modelValue": [rowIds: string[]];
}>();


const selectedRows = ref<string[]>([]);

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    selectedRows.value = props.rows.map((row) => row.id);
  } else {
    selectedRows.value = [];
  }
}

function onRowSelect(rowId: string) {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value.splice(selectedRows.value.indexOf(rowId), 1);
  } else {
    selectedRows.value.push(rowId);
  }
}
</script>

<template>

  <div class="overflow-auto relative w-full">
    <TRCDataTableHeader
      :columns="columns"
      :selectedRows="selectedRows"
      :totalRows="rows.length"
      @rows:selectAll="onRowsSelectAll"
      @col:setPin="$emit('col:setPin', $event)"
    />
    <TRCDataTableRow
      v-for="row in rows"
      :key="row.id"
      :data="row"
      :columns="columns"
      :selectedRows="selectedRows"
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
