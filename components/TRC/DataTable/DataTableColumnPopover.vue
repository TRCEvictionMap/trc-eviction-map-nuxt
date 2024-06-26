<script setup lang="ts" generic="Field extends string">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import type { DataTableColumn } from "./data-table-types";

const props = defineProps<{
  data: DataTableColumn<Field>;
  sortBy: Field | null;
  sortDirection?: SortDirection | null;
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

function onSortDirection(close: () => void, direction: SortDirection) {
  emit("col:sort:direction", { field: props.data.field, direction });
  close();
}

const description = computed(() =>
  props.data.description?.trim().replace(/\n{3,}/g, "\n")
);

</script>

<template>
  <TRCPopover
    isFloating
    alignment="start"
    :allowedPlacements="['bottom', 'bottom-start', 'bottom-end', 'top', 'top-end', 'top-start']"
  >
    <template #button="{ open, close }">
      <div class="flex justify-between items-center w-full">
        <span role="columnheader">{{ data.headerText }}</span>
        <div :class="{ 'hover-show-child': !open }">
          <IconEllipsisVertical class="h-[18px] w-[18px]" />
        </div>
      </div>
    </template>
    <template #="{ open, close }">
      <div class="flex flex-col w-52 gap-2 font-semibold text-slate-800 text-sm p-2">
        <div class="space-y-1">
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
          <template v-if="!data.disableSort">

            <button
              class="menu-button"
              :class="{
                'menu-button--selected': sortBy === data.field && sortDirection === 'desc'
              }"
              @click="onSortDirection(close, 'desc')"
            >
              <IconChevronDown class="h-[14px] w-[14px]" /> Sort high to low
            </button>
            <button
              class="menu-button"
              :class="{
                'menu-button--selected': sortBy === data.field && sortDirection === 'asc'
              }"
              @click="onSortDirection(close, 'asc')"
            >
              <IconChevronUp class="h-[14px] w-[14px]" /> Sort low to high
            </button>
          </template>
        </div>
        <div class="border-b mx-2"></div>
        <Disclosure
          #="{ open }: { open: boolean }"
          as="div"
          class="flex flex-col gap-2 p-2"
        >
          <DisclosureButton class="flex gap-2">
            <div class="relative w-4 translate-y-[1px]">
              <IconMinus class="absolute left-0 h-[18px] w-[18px]" />
              <IconMinus
                class="absolute left-0 transition-transform h-[18px] w-[18px]"
                :class="{
                  'rotate-0': open,
                  'rotate-90': !open
                }"
              />
            </div>
            <span>Description</span>
          </DisclosureButton>
          <DisclosurePanel class="whitespace-pre-line font-normal">
            {{ description ?? "No description" }}
          </DisclosurePanel>
        </Disclosure>
      </div>
    </template>
  </TRCPopover>
</template>

<style scoped>
.menu-button {
  @apply p-1 px-2 rounded w-full hover:bg-slate-100 flex items-center gap-2;
}

.menu-button--selected {
  @apply bg-slate-800 text-white hover:bg-slate-800/90 focus:bg-slate-800/90;
}
</style>