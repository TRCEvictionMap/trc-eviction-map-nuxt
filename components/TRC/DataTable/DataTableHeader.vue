<script setup lang="ts" generic="Field extends string">
import type { TableColumns } from "./use-columns";

const props = defineProps<{
  columns: TableColumns<Field>;
  totalRows: number;
  selectedRows: string[];
}>();

const emit = defineEmits<{
  "rows:selectAll": [selectAll: boolean];
  "col:setPin": [payload: { field: string, pinned: boolean }];
}>();

const { colWidths, cols, colsPinned, tableWidth } = props.columns;

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
  <div class="flex sticky top-0 z-10" :style="{ width: `${tableWidth}px` }">
    <div class="sticky left-0 top-0 z-10 bg-white">
      <div class="flex bg-slate-300/40">
        <div class="dt-cell">
          <TRCCheckbox v-model="isSelectAll" />
        </div>
        <div
          v-for="col in colsPinned"
          :key="col.field"
          class="dt-cell font-bold text-sm justify-between  hover-show-parent"
          :style="{ width: `${colWidths[col.field]}px`}"
        >
          <span>
            {{ col.headerText }}
          </span>
          <button class="hover-show-child" @click="$emit('col:setPin', { field: col.field, pinned: !col.pinned })">
            <IconPinAngleFill v-if="col.pinned" class="h-[14px] w-[14px]" />
            <IconPinAngle v-else class="h-[14px] w-[14px]" />
          </button>
        </div>
      </div>

    </div>
    <div class="flex bg-white">
      <div
        v-for="col in cols"
        :key="col.field"
        class="dt-cell font-bold text-sm justify-between  hover-show-parent"
        :style="{ width: `${colWidths[col.field]}px`}"
      >
        <span>
          {{ col.headerText }}
        </span>
        <button class="hover-show-child" @click="$emit('col:setPin', { field: col.field, pinned: !col.pinned })">
          <IconPinAngleFill v-if="col.pinned" class="h-[14px] w-[14px]" />
          <IconPinAngle v-else class="h-[14px] w-[14px]"  />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-show-child {
  opacity: 0;
  transition: opacity 0.08s;
}

.hover-show-child:focus {
}

.hover-show-parent:hover .hover-show-child,
.hover-show-child:focus {
  opacity: 1;
}
</style>