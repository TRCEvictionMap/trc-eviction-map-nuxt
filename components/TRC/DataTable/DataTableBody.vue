<script setup lang="ts" generic="Field extends string">
import { useColumns } from "./composables";
import type { DataTableColumn, DataTableRow } from "./data-table-types";

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
  selectedRows: string[];
}>();

const { colWidths, cols, colsPinned } = useColumns(props.columns);

defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
}>();
</script>

<template>
  <div>
    <div
      v-for="row in rows"
      :key="row.id"
      @mouseover="$emit('row:mouseover', row.id)"
      @mouseleave="$emit('row:mouseleave', row.id)"
    >
      <div class="flex sticky left-0 bg-white">
        <div class="dt-cell">

        </div>
      </div>
    </div>
  </div>
</template>