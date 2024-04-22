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
  <table class="relative h-full overflow-auto block border">
    <colgroup>
      <slot name="colgroup"></slot>
    </colgroup>
    <thead class="relative z-10">
      <tr class="sticky top-0 bg-white">
        <th scope="col" class="sticky left-0 bg-slate-300">
          ID
        </th>
        <template v-for="column in columns">
          <slot name="th" v-bind="{ column }"></slot>
        </template>
      </tr>
    </thead>
    <tbody class="relative z-0">
      <template v-for="row in rows">
        <slot name="row" v-bind="{ row }"></slot>
      </template>
    </tbody>
  </table>
</template>