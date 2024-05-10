<script setup lang="ts" generic="T">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

const props = defineProps<{
  items: T[];
  modelValue: T[];
  initalPageSize?: number;
  initialPage?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [pageItems: T[]],
}>();

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 0;

const {
  page,
  pageCount,
  pageSize,
  pageItems,
  isNextPage,
  isPrevPage,
  nextPage,
  prevPage,
} = usePagination({
  page: props.initialPage ?? DEFAULT_PAGE,
  pageSize: props.initalPageSize ?? DEFAULT_PAGE_SIZE,
  items: computed(() => props.items),
});

watch(pageItems, () => {
  emit("update:modelValue", pageItems.value);
}, { immediate: true });

const pageDisplay = computed(() => page.value + 1);

// function handlePageNumberInput(ev: Event) {
//   try {
//     const target = (ev.target as HTMLInputElement);
//     const value = Number.parseFloat(target.value);
//     if (value > 0) {
//       page.value = value - 1;
//     }
//     target.value = pageDisplay.value.toString();
//   } catch (_error) {}
// }
function handlePageNumberInput(ev: Event) {
  try {
    const target = (ev.target as HTMLInputElement);
    const value = Number.parseFloat(target.value);
    // if (value > 0 && value <= pageCount.value) {
    if (value > 0) {
      page.value = value - 1;
    // } else {
      target.value = pageDisplay.value.toString();
    }
  } catch (_error) {}
}

const rowsPerPage = [10, 20, 50].map((value) => ({
  value,
  text: `${value} rows`,
}));

</script>

<template>
  <div class="py-2 flex items-center gap-2">
    <button :disabled="!isPrevPage" @click="prevPage" class="pagination-button">
      <IconChevronUp class="-rotate-90 h-[20px] w-[20px]" />
    </button>
    <div class="flex justify-center items-center gap-2">
      <input
        type="number"
        :value="pageDisplay"
        @input="handlePageNumberInput"
        :min="1"
        :max="pageCount"
        class="w-10 px-2 rounded"
      >
      <span>of {{ pageCount }}</span>
    </div>
    <button :disabled="!isNextPage" @click="nextPage" class="pagination-button">
      <IconChevronUp class="rotate-90 h-[20px] w-[20px]" />
    </button>
    <TRCSelect v-model="pageSize" :options="rowsPerPage" dropUp />
  </div>
</template>

<style scoped>

input[type="number"] {
  appearance: textfield;
}

.pagination-button {
  @apply rounded border  p-1;
}

</style>