
const DIRECTIONS = ["desc", "asc"] as const;

type SortDirection = typeof DIRECTIONS[number];

function useSortState<Field>() {
  const cursor = ref(-1);

  const sortBy = ref<Field>();
  const sortDirection = computed(() => DIRECTIONS[cursor.value]);

  function setSortState(options: { field: Field, direction: SortDirection }) {
    cursor.value = DIRECTIONS.indexOf(options.direction);
    sortBy.value = options.field;
  }

  function clearSortState() {
    cursor.value = -1;
    sortBy.value = undefined;
  }

  function incrementSortState(field: Field) {
    const nextCursor = cursor.value + 1;
    if (sortBy.value !== field) {
      sortBy.value = field;
    }
    if (nextCursor < DIRECTIONS.length) {
      cursor.value = nextCursor;
    } else {
      clearSortState();
    }
  }

  return {
    sortBy,
    sortDirection,
    setSortState,
    clearSortState,
    incrementSortState
  };
}

export { useSortState };
export type { SortDirection };
