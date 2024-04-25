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
  "col:setPin": [payload: { field: string, pinned: boolean }];
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
    <div class="sticky left-0 top-0 flex bg-blue-200">
      <div class="dt-cell">
        <TRCCheckbox v-model="isSelectAll" />
      </div>
      <div
        v-for="col in colsPinned"
        :key="col.field"
        class="dt-cell font-bold text-sm justify-between"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        <span>
          {{ col.headerText }}
        </span>
        <button @click="$emit('col:setPin', { field: col.field, pinned: !col.pinned })">pin</button>
      </div>
    </div>
    <div class="flex bg-orange-200">
      <div
        v-for="col in cols"
        :key="col.field"
        class="dt-cell font-bold text-sm justify-between"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        <span>
          {{ col.headerText }}
        </span>
        <button @click="$emit('col:setPin', { field: col.field, pinned: !col.pinned })">pin</button>
      </div>
    </div>
  </div>
</template>