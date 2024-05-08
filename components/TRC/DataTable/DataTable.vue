<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from "./data-table-types";
import { useTableColumns } from "./use-columns";

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  modelValue: string[];
  initalPageSize: number;
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

const visibleRows: Ref<DataTableRow<Field>[]> = ref([]);

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    emit("update:modelValue", visibleRows.value.map((row) => row.id));
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
          v-for="row in visibleRows"
          :key="row.id"
          :data="(row as DataTableRow<Field>)"
          :columns="tableColumns"
          :selectedRows="modelValue"
          @row:mouseleave="$emit('row:mouseleave', $event)"
          @row:mouseover="$emit('row:mouseover', $event)"
          @row:select="onRowSelect"
        />
      </div>
    </div>
    <TRCDataTablePagination
      :items="sortedRows"
      :initalPageSize="initalPageSize"
      v-model="visibleRows"
    />
  </div>

</template>

<style>
.dt-cell {
  @apply p-2 flex items-center whitespace-nowrap border;
}
</style>
