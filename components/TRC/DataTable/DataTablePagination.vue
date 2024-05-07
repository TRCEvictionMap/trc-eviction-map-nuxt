<script setup lang="ts" generic="T">
const props = defineProps<{
  items: T[];
  modelValue: T[];
}>();

const emit = defineEmits<{
  "update:modelValue": [pageItems: T[]],
}>();

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
  page: 0,
  pageSize: 12,
  items: computed(() => props.items),
});

watch(pageItems, () => {
  emit("update:modelValue", pageItems.value);
}, { immediate: true });

const pageDisplay = computed(() => page.value + 1);

function handlePageNumberInput(ev: Event) {
  try {
    const target = (ev.target as HTMLInputElement);
    const value = Number.parseFloat(target.value);
    if (value > 0 && value <= pageCount.value) {
      page.value = value - 1;
    } else {
      target.value = pageDisplay.value.toString();
    }
  } catch (_error) {}
}
</script>

<template>
  <div class="py-2 flex gap-2">
    <button :disabled="!isPrevPage" @click="prevPage" class="button">prev</button>
      <div class="flex items-center gap-2">
        <input
          type="number"
          :value="pageDisplay"
          @input="handlePageNumberInput"
          :min="1"
          :max="pageCount"
          class="w-16 p-2"
        >
        <span>of {{ pageCount }}</span>
      </div>
      <button :disabled="!isNextPage" @click="nextPage" class="button">next</button>
  </div>
</template>