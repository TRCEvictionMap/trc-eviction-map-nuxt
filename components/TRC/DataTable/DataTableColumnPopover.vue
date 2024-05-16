<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn } from './data-table-types';

const props = defineProps<{
  data: DataTableColumn<Field>;
}>();

const emit = defineEmits<{
  "col:pin": [{ field: Field; pinned: boolean }];
  "col:sort:increment": [field: Field];
  "col:sort:direction": [{ field: Field; direction: SortDirection }];
}>();

function sortIncrement(close: () => void) {
  emit("col:sort:increment", props.data.field);
  close();
}

function sortDirection(close: () => void, direction: SortDirection) {
  emit("col:sort:direction", { field: props.data.field, direction });
  close();
}

</script>

<template>
  <TRCPopover>
    <template #button="{ open, close }">
      <div class="flex justify-between items-center w-full">
        <span role="columnheader">{{ data.headerText }}</span>
        <div :class="{ 'hover-show-child': !open }">
          <IconEllipsisVertical class="h-[18px] w-[18px]" />
        </div>
      </div>
    </template>
    <template #="{ open, close }">
      <div class="flex flex-col w-44 gap-2">
        <div>
          <button
            @click="$emit('col:pin', { field: data.field, pinned: !data.pinned })"
            role="checkbox"
            class="menu-button"
          >
            <template v-if="data.pinned">
              <IconPinAngleFill class="h-[14px] w-[14px]" /> Unpin column
            </template>
            <template v-else>
              <IconPinAngle class="h-[14px] w-[14px]" /> Pin column
            </template>
          </button>
          <button class="menu-button" @click="sortDirection(close, 'asc')">
            <IconChevronUp class="h-[14px] w-[14px]" /> Sort low to high
          </button>
          <button class="menu-button" @click="sortDirection(close, 'desc')">
            <IconChevronDown class="h-[14px] w-[14px]" /> Sort high to low
          </button>
        </div>
        <div
          v-if="data.description"
          class="whitespace-pre-line font-normal pt-2 border-t"
        >
          {{ data.description }}
        </div>
      </div>
    </template>
  </TRCPopover>
</template>

<style scoped>
.menu-button {
  @apply p-1 px-2 rounded w-full hover:bg-slate-100 flex items-center gap-2;
}
</style>