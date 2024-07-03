<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from "./data-table-types";
import { useTableColumns } from "./use-columns";

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  modelValue: string[];
  initalPageSize: 10 | 20 | 50;
  enableSelectAll?: boolean;
  maxSelectableRows?: number;
  hoveredRow?: string;
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "rows:select": [rowIds: string[]];
  "col:pin": [payload: { field: string, pinned: boolean }];
  "update:modelValue": [rowIds: string[]];
}>();

const tableColumns = useTableColumns(props.columns);

const selectedRowIds = computed(() => props.modelValue);
const selectedRows = computed(
  () => props.rows.filter(
    (row) => selectedRowIds.value.includes(row.id)
  )
);

const {
  incrementSortState,
  setSortState,
  sortBy,
  sortDirection,
  data: sortedRows,
} = useSort<Field, DataTableRow<Field>>(
  computed(
    () => props.rows.filter((row) => !selectedRowIds.value.includes(row.id))
  ),
  (a, b, sortBy, direction) => {
    if (typeof a.fields[sortBy].value === "number") {
      const _a = a.fields[sortBy].value as number;
      const _b = b.fields[sortBy].value as number;
      return direction === "asc" ? _a - _b : _b - _a;
    }
    return 0;
  }
);

const pageRows: Ref<DataTableRow<Field>[]> = ref([]);
const pageRowIds = computed(() => pageRows.value.map((row) => row.id));

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    emit("update:modelValue", pageRows.value.map((row) => row.id));
  } else {
    emit("update:modelValue", []);
  }
}

function onRowSelect(rowId: string) {
  if (selectedRowIds.value.includes(rowId)) {
    emit("update:modelValue", selectedRowIds.value.filter((x) => x !== rowId));
  } else {
    emit("update:modelValue", selectedRowIds.value.concat(rowId));
  }
}

</script>

<template>
  <div class="flex flex-col">
    <TRCDataTableTop
      :columns="columns"
      :sortBy="sortBy"
      :sortDirection="sortDirection"
      @col:sort:direction="setSortState"
    />
    <div class="h-full overflow-auto flex-1">
      <TRCDataTableHeader
        :sortBy="sortBy"
        :sortDirection="sortDirection"
        :columns="tableColumns"
        :selectedRows="selectedRowIds"
        :visibleRows="pageRowIds"
        :enableSelectAll="enableSelectAll"
        @rows:selectAll="onRowsSelectAll"
        @col:pin="$emit('col:pin', $event)"
        @col:sort:increment="incrementSortState"
        @col:sort:direction="setSortState"
      />
      <div
        role="rowgroup"
        class="sticky z-30 top-10"
      >
        <TRCDataTableRow
          v-for="row in selectedRows"
          :key="row.id"
          :data="(row as DataTableRow<Field>)"
          :columns="tableColumns"
          :selectedRows="selectedRowIds"
          :hoveredRow="hoveredRow"
          @row:mouseleave="$emit('row:mouseleave', $event)"
          @row:mouseover="$emit('row:mouseover', $event)"
          @row:select="onRowSelect"
        />
      </div>
      <div role="rowgroup">
        <TRCDataTableRow
          v-for="row in pageRows"
          :key="row.id"
          :data="(row as DataTableRow<Field>)"
          :columns="tableColumns"
          :selectedRows="selectedRowIds"
          :hoveredRow="hoveredRow"
          @row:mouseleave="$emit('row:mouseleave', $event)"
          @row:mouseover="$emit('row:mouseover', $event)"
          @row:select="onRowSelect"
        />
      </div>
    </div>

    <TRCDataTablePagination
      :items="sortedRows"
      :initalPageSize="initalPageSize"
      v-model="pageRows"
    />
  </div>
</template>

<style>
.dt-cell {
  @apply p-2 flex items-center whitespace-nowrap border;
}
</style>
