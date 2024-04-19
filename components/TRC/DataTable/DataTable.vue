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
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th v-for="column in columns">
          {{ column.headerText }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.id"
        @mouseover="$emit('row:mouseover', row.id)"
        @mouseleave="$emit('row:mouseleave', row.id)"
      >
        <slot name="row" v-bind="{ row }">
          <td>{{ row.id }}</td>
          <td v-for="column in columns">
            {{ row.fields[column.field] }}
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>