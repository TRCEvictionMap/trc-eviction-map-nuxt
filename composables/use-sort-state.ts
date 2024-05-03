
const DIRECTIONS = ["desc", "asc"] as const;

type SortDirection = typeof DIRECTIONS[number];

function useSortState<Field>() {
  const cursor = ref(-1);

  const sortBy = ref<Field>();
  const sortDirection = computed(() => DIRECTIONS[cursor.value]);

  function setSortState(field: Field) {
    const nextCursor = cursor.value + 1;
    if (sortBy.value !== field) {
      sortBy.value = field;
    }
    if (nextCursor < DIRECTIONS.length) {
      cursor.value = nextCursor;
    } else {
      cursor.value = -1;
      sortBy.value = undefined;
    }
  }

  return { sortBy, sortDirection, setSortState };
}

export { useSortState };
export type { SortDirection };
