<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from './data-table-types';

defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
}>();

defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
}>();
</script>

<template>

  <table class="relative h-full overflow-auto block border border-collapse">
    <colgroup>
      <slot name="colgroup"></slot>
    </colgroup>
    <thead class="relative z-10">
      <tr class="sticky top-0 bg-white p-2">
        <th align="left" scope="col" class="sticky left-0 bg-slate-300 px-2">
          ID
        </th>
        <th
          v-for="column in columns"
          :key="column.field"
          :title="column.headerTitle"
          scope="col"
          class="whitespace-nowrap px-4 bg-slate-100" 
        >
          {{ column.headerText }}
        </th>
      </tr>
    </thead>
    <tbody class="relative z-0">
      <template v-for="row in rows">
        <slot name="row" v-bind="{ row }"></slot>
      </template>
    </tbody>
  </table>
</template>