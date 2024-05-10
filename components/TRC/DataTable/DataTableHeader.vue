<script setup lang="ts" generic="Field extends string">
import type { TableColumns } from "./use-columns";

const props = defineProps<{
  columns: TableColumns<Field>;
  sortBy?: Field;
  sortDirection?: "asc" | "desc" | null;
  totalVisibleRows: number;
  selectedRows: string[];
  enableSelectAll?: boolean;
}>();

const emit = defineEmits<{
  "rows:selectAll": [selectAll: boolean];
  "col:pin": [payload: { field: string, pinned: boolean }];
  "col:sort": [field: Field];
}>();

const { colWidths, cols, colsPinned, tableWidth } = props.columns;

const isSelectAll = computed({
  get() {
    return props.totalVisibleRows === props.selectedRows.length;
  },
  set(selectAll) {
    emit("rows:selectAll", selectAll);
  },
});

</script>

<template>
  <div role="row" class="flex sticky top-0 z-10" :style="{ width: `${tableWidth}px` }">
    <div class="sticky left-0 top-0 z-10 bg-white">
      <div class="flex bg-slate-300/40">
        <div role="columnheader" class="dt-cell border-r-transparent">
          <TRCCheckbox v-if="enableSelectAll" v-model="isSelectAll" />
          <div v-else class="h-6 w-4"></div>
        </div>
        <div
          v-for="col in colsPinned"
          :key="col.field"
          :style="{ width: `${colWidths[col.field]}px`}"
          class="dt-cell border-l-transparent font-bold text-sm justify-between hover-show-parent"
        >
          <button class="flex items-center" @click="$emit('col:sort', col.field)">
            <span role="columnheader">{{ col.headerText }}</span>
            <IconChevronDown
              v-if="!col.disableSort"
              class="h-[14px] transition"
              stroke-width="3"
              :stroke-opacity="sortBy === col.field ? 1 : 0.3"
              :class="{
                'rotate-180': sortDirection === 'asc',
                'hover-show-child': sortBy !== col.field,
              }"
            />
          </button>
          <button class="hover-show-child" @click="$emit('col:pin', { field: col.field, pinned: !col.pinned })">
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
        :style="{ width: `${colWidths[col.field]}px`}"
        class="dt-cell font-bold text-sm justify-between  hover-show-parent"
      >
        <button class="flex items-center" @click="$emit('col:sort', col.field)">
          <span role="columnheader">{{ col.headerText }}</span>
          <IconChevronDown
            v-if="!col.disableSort"
            class="h-[14px] transition"
            stroke-width="3"
            :stroke-opacity="sortBy === col.field ? 1 : 0.3"
            :class="{
              'rotate-180': sortDirection === 'asc',
              'hover-show-child': sortBy !== col.field,
            }"
          />
        </button>
        <button class="hover-show-child" @click="$emit('col:pin', { field: col.field, pinned: !col.pinned })">
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

.hover-show-parent:hover .hover-show-child,
.hover-show-child:focus {
  opacity: 1;
}
</style>