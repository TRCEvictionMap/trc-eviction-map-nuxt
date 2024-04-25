<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn, DataTableRow } from './data-table-types';

const props = defineProps<{
  columns: DataTableColumn<Field>[];
  rows: DataTableRow<Field>[];
}>();


const emit = defineEmits<{
  "row:mouseover": [rowId: string];
  "row:mouseleave": [rowId: string];
  "update:modelValue": [rowIds: string[]];
}>();


const selectedRows = ref<string[]>([]);

function onRowsSelectAll(selectAll: boolean) {
  if (selectAll) {
    selectedRows.value = props.rows.map((row) => row.id);
  } else {
    selectedRows.value = [];
  }
}

function onRowSelect(rowId: string) {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value.splice(selectedRows.value.indexOf(rowId), 1);
  } else {
    selectedRows.value.push(rowId);
  }
}
</script>

<template>

  <div class="overflow-auto relative w-full">
    <TRCDataTableHeader
      :columns="columns"
      :selectedRows="selectedRows"
      :totalRows="rows.length"
      @rows:selectAll="onRowsSelectAll"
    />
    <div>
      <TRCDataTableRow
        v-for="row in rows"
        :key="row.id"
        :data="row"
        :columns="columns"
        :selectedRows="selectedRows"
        @row:mouseleave="$emit('row:mouseleave', $event)"
        @row:mouseover="$emit('row:mouseover', $event)"
        @row:select="onRowSelect"
      />
    </div>


    <!-- <div class="z-10">
      <div v-for="row in rows" class="flex hover:bg-slate-100">
        <div class="flex sticky left-0 bg-white">
          <div class="dt-cell">
            <button role="checkbox">
              <IconSquare />
            </button>
          </div>
          <div v-for="col in _columnsPinned" class="dt-cell" :style="{ width: `${columnWidths[col.field]}px`}">
            {{ row.fields[col.field].text || row.fields[col.field].value }}
          </div>
        </div>

        <div class="flex">
          <div v-for="col in _columns" class="dt-cell" :style="{ width: `${columnWidths[col.field]}px`}">
            {{ row.fields[col.field].text || row.fields[col.field].value }}
          </div>
        </div>
      </div>
    </div> -->
  </div>

</template>

<style>

.dt-cell {
  @apply p-2 flex items-center whitespace-nowrap border;
}
</style>

  <!-- <div class="grid grid-cols-12 w-full">
    <div class="col-span-2 grid grid-cols-2">
      <div v-for="n in 2" class="bg-cyan-300">{{ n }}</div>
    </div>
    <div class="col-span-10 grid grid-cols-10">
      <div v-for="n in 10" class="flex flex-nowrap min-w-[120px]" >
        Cell {{ n }}
      </div>
    </div>
  </div> -->

  <!-- <div class="flex overflow-auto">
    <div class="grid grid-cols-2">
      <div
        class="grid"
        :style="{
          gridTemplateColumns: `repeat(${_columnsPinned.length}, 1fr)`
        }"
      >
        <div
          v-for="col in _columnsPinned"
          :key="col.field"
          class="bg-slate-100"
        >
          {{ col.headerText }}
        </div>
      </div>
      <div
        class="grid"
        :style="{
          gridTemplateColumns: `repeat(${_columns.length}, 1fr)`
        }"
      >
        <div v-for="col in _columns" :key="col.field" class="bg-slate-100">
          {{ col.headerText }}
        </div>
      </div>
    </div>
    <div>
      <div
        v-for="row in rows"
        :key="row.id"
      >
        <div
          class="grid"
          :style="{
            gridTemplateColumns: `repeat(${_columnsPinned.length}, 1fr)`
          }"
        >
          <div
            v-for="col in _columnsPinned"
            :key="col.field"
          >
              {{ row.fields[col.field].text || row.fields[col.field].value }}
          </div>
        </div>
        <div
        class="grid"
        :style="{
          gridTemplateColumns: `repeat(${_columns.length}, 1fr)`
        }"
        >
          <div v-for="col in _columns" :key="col.field">
            {{ row.fields[col.field].text || row.fields[col.field].value }}
          </div>
        </div>
      </div>
    </div>
  </div> -->
<!-- </template> -->

<!-- <template>
  <table class="relative h-full overflow-auto block border">
    <colgroup>
      <slot name="colgroup"></slot>
    </colgroup>
    <thead class="relative z-10">
      <tr class="sticky top-0 bg-white">
        <th>
          <button role="checkbox" @click="isSelectAllRows = !isSelectAllRows">
            <IconCheckSquareFill v-if="isSelectAllRows" class="text-trc-blue-500" />
            <IconSquare v-else />
          </button>
        </th>
        <th scope="col" class="sticky left-0 bg-slate-300">
          ID
        </th>
        <template v-for="column in columns">
          <slot name="th" v-bind="{ column }"></slot>
        </template>
      </tr>
    </thead>
    <tbody class="relative z-0">
      <tr
        v-for="{ id: rowId, fields } in rows"
        :key="rowId"
        @mouseleave="$emit('row:mouseleave', rowId)"
        @mouseover="$emit('row:mouseover', rowId)"
        class="divide-x divide-y"
        :class="{
          'ring-1 ring-black bg-trc-blue-100': modelValue.includes(`d_${rowId}`)
        }"
      >
        <td class="sticky left-0">
          <button
            role="checkbox"
            :aria-checked="modelValue.includes(`d_${rowId}`)"
            @click="onSelectRow(`d_${rowId}`)"
          >
            <IconCheckSquareFill v-if="modelValue.includes(`d_${rowId}`)" class="text-trc-blue-500" />
            <IconSquare v-else />
          </button>
        </td>
        <td scope="col" class="sticky z-10 left-0 bg-slate-100 shadow-slate-950 py-2 px-2 border-b">
          {{ rowId }}
        </td>


        <td v-for="{ field } in columns" scope="col" :key="field" class="px-4">
          <div class="flex justify-between items-end">
            <span>{{ fields[field].text || fields[field].value }}</span>
            <span v-if="fields[field].moe" class="text-sm">&plusmn;{{ fields[field].moe }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template> -->