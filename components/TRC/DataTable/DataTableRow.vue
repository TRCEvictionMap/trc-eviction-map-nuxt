<script setup lang="ts" generic="Field extends string">
import type { TableColumns } from "./use-columns";
import type { DataTableRow } from "./data-table-types";

const props = defineProps<{
  data: DataTableRow<Field>;
  columns: TableColumns<Field>;
  selectedRows: string[];
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "row:select": [rowId: string];
}>();

const { colWidths, cols, colsPinned, tableWidth } = props.columns;

const isSelected = computed({
  get() {
    return props.selectedRows.includes(props.data.id);
  },
  set() {
    emit("row:select", props.data.id);
  },
});

</script>

<template>
  <div
    class="flex"
    :style="{ width: `${tableWidth}px` }"
    @mouseover="$emit('row:mouseover', data.id)"
    @mouseleave="$emit('row:mouseleave', data.id)"
  >
    <div class="sticky left-0 bg-white shadow-xl">
      <div class="flex bg-slate-100/60">
        <div class="dt-cell">
          <TRCCheckbox v-model="isSelected" />
        </div>
        <div
          v-for="col in colsPinned"
          :key="col.field"
          class="dt-cell"
          :style="{ width: `${colWidths[col.field]}px`}"
        >
          {{ data.fields[col.field].text || data.fields[col.field].value }}
        </div>
      </div>
    </div>
    <div class="flex">
      <div
        v-for="col in cols"
        :key="col.field"
        class="dt-cell"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        {{ data.fields[col.field].text || data.fields[col.field].value }}
      </div>
    </div>
  </div>
</template>

