<script setup lang="ts" generic="Field extends string">
import { useColumns } from "./composables";
import type { DataTableColumn } from "./data-table-types";

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  totalRows: number;
  selectedRows: string[];
}>();

const emit = defineEmits<{
  "rows:selectAll": [selectAll: boolean];
}>();

const { colWidths, cols, colsPinned } = useColumns(props.columns);

const isSelectAll = computed({
  get() {
    return props.totalRows === props.selectedRows.length;
  },
  set(selectAll) {
    emit("rows:selectAll", selectAll);
  },
});

</script>

<template>
  <div class="flex sticky top-0 z-30">
    <div class="sticky left-0 top-0 flex bg-white">
      <div class="dt-cell">
        <TRCCheckbox v-model="isSelectAll" />
      </div>
      <div
        v-for="col in colsPinned"
        :key="col.field"
        class="dt-cell font-bold text-sm"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        {{ col.headerText }}
      </div>
    </div>
    <div class="flex bg-white w-full">
      <div
        v-for="col in cols"
        :key="col.field"
        class="dt-cell font-bold text-sm"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        {{ col.headerText }}
      </div>
    </div>
  </div>
</template>