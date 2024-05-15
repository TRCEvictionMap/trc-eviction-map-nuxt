<script setup lang="ts" generic="Field extends string">
import type { DataTableColumn } from './data-table-types';

defineProps<{
  data: DataTableColumn<Field>;
}>();

defineEmits<{
  "col:pin": [{ field: Field; pinned: boolean }];
}>();

</script>

<template>
  <TRCPopover>
    <template #button="{ open }">
      <div :class="{ 'hover-show-child': !open }">
        <IconEllipsisVertical class="h-[18px] w-[18px]" />
      </div>
    </template>
    <div class="flex flex-col gap-2 ">
      <h3>{{ data.headerText }}</h3>
      <button
        @click="$emit('col:pin', { field: data.field, pinned: !data.pinned })"
        role="checkbox"
        class="p-1 rounded w-full hover:bg-slate-100"
      >
        <div
          v-if="data.pinned"
          class="flex items-center gap-2"
        >
          <IconPinAngleFill class="h-[14px] w-[14px]" /> Unpin column
        </div>
        <IconPinAngle
          v-else
          class="h-[14px] w-[14px]"
        />
      </button>
      <div v-if="data.description" class="whitespace-pre-line">
        {{ data.description }}
      </div>
    </div>
  </TRCPopover>
</template>