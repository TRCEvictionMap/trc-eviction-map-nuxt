<script setup lang="ts" generic="Field extends string">
import type { TableColumns } from "./use-columns";
import type { DataTableRow } from "./data-table-types";

const props = defineProps<{
  data: DataTableRow<Field>;
  columns: TableColumns<Field>;
  selectedRows: string[];
  isHovered?: boolean;
  hoveredRow?: string;
}>();

const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "row:select": [rowId: string];
  "flyTo": [featureId: string];
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
    class="relative flex bg-white"
    :class="{
      'ring-1 ring-slate-400 z-10': isHovered,
    }"
    role="row"
    :style="{ width: `${tableWidth}px` }"
    @mouseover="$emit('row:mouseover', data.id)"
    @mouseleave="$emit('row:mouseleave', data.id)"
  >
    <div class="sticky left-0 bg-white">
      <div class="flex bg-slate-100/60">
        <div class="dt-cell">
          <TRCCheckbox v-model="isSelected" />
        </div>
        <div class="dt-cell">
          <TRCButton @click="$emit('flyTo', data.id)" title="Fly to feature on map">
            <IconViewfinderCircle class="h-4 w-4" />
          </TRCButton>
        </div>
        <div
          v-for="col in colsPinned"
          :key="col.field"
          :aria-label="col.headerText"
          :style="{ width: `${colWidths[col.field]}px`}"
          role="cell"
          class="dt-cell justify-between"
        >
          <div class="flex items-center justify-center gap-2">
            <span>
              <slot name="cell-left" v-bind="{ field: col.field }"></slot>
            </span>
            <span>
              {{ data.fields[col.field].text || data.fields[col.field].value }}
            </span>
          </div>
          <span v-if="data.fields[col.field].moe" class="text-sm">
            &plusmn;{{ data.fields[col.field].moe }}
          </span>
          <span v-if="data.fields[col.field].srOnly" class="sr-only">
            {{ data.fields[col.field].srOnly }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex">
      <div
        v-for="col in cols"
        :key="col.field"
        :aria-label="col.headerText"
        :style="{ width: `${colWidths[col.field]}px`}"
        role="cell"
        class="dt-cell justify-between"
      >
        <div class="flex items-center justify-between">
          <span>
            <slot name="cell-left" v-bind="{ field: col.field }"></slot>
          </span>
          <span>
            {{ data.fields[col.field].text || data.fields[col.field].value }}
          </span>
        </div>
        <span v-if="data.fields[col.field].moe" class="text-sm">
          &plusmn;{{ data.fields[col.field].moe }}
        </span>
        <span v-if="data.fields[col.field].srOnly" class="sr-only">
          {{ data.fields[col.field].srOnly }}
        </span>
      </div>
    </div>
  </div>
</template>

