<script setup lang="ts" generic="Field extends string">
import type { TableColumns } from "./use-columns";

const props = defineProps<{
  columns: TableColumns<Field>;
  sortBy: Field | null;
  sortDirection?: SortDirection | null;
  visibleRows: string[];
  selectedRows: string[];
  enableSelectAll?: boolean;
}>();

const emit = defineEmits<{
  "rows:selectAll": [selectAll: boolean];
  "col:pin": [{ field: string, pinned: boolean }];
  "col:sort:increment": [field: Field];
  "col:sort:direction": [{ field: Field, direction: SortDirection }];
}>();

const { colWidths, cols, colsPinned, tableWidth } = props.columns;

const isSelectAll = computed({
  get() {
    return props.visibleRows.every((rowId) => props.selectedRows.includes(rowId));
  },
  set(selectAll) {
    emit("rows:selectAll", selectAll);
  },
});

</script>

<template>
  <div
    role="row"
    class="flex sticky top-0 z-10"
    :style="{ width: `${tableWidth}px` }"
  >
    <div class="sticky left-0 top-0 z-10 bg-white">
      <div class="flex bg-slate-300/40">
        <div
          role="columnheader"
          class="dt-cell border-r-transparent"
        >
          <TRCCheckbox
            v-if="enableSelectAll"
            v-model="isSelectAll"
          />
          <div
            v-else
            class="h-6 w-4"
          ></div>
        </div>
        <div
          v-for="col in colsPinned"
          :key="col.field"
          :style="{ width: `${colWidths[col.field]}px` }"
          class="dt-cell border-l-transparent font-bold text-sm justify-between hover-show-parent"
        >
          <TRCDataTableColumnPopover
            :data="col"
            @col:pin="$emit('col:pin', $event)"
            @col:sort:increment="$emit('col:sort:increment', $event)"
            @col:sort:direction="$emit('col:sort:direction', $event)"
          />
        </div>
      </div>

    </div>
    <div class="flex bg-white">
      <div
        v-for="col in cols"
        :key="col.field"
        :style="{ width: `${colWidths[col.field]}px` }"
        class="dt-cell font-bold text-sm justify-between  hover-show-parent"
      >
        <TRCDataTableColumnPopover
          :data="col"
          @col:pin="$emit('col:pin', $event)"
          @col:sort:increment="$emit('col:sort:increment', $event)"
          @col:sort:direction="$emit('col:sort:direction', $event)"
        />
      </div>
    </div>
  </div>
</template>
