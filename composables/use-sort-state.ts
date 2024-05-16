

interface SetSortStateOptions<Field> {
  field: Field | null;
  direction: SortDirection;
}

const DIRECTIONS = ["desc", "asc"] as const;

type SortDirection = typeof DIRECTIONS[number];

function useSortState<Field>() {
  const cursor = ref(0);

  const sortBy: Ref<Field | null> = ref(null);
  const sortDirection = computed(() => DIRECTIONS[cursor.value]);

  function setSortState({ field, direction }: SetSortStateOptions<Field>) {
    cursor.value = DIRECTIONS.indexOf(direction);
    sortBy.value = field;
  }

  function clearSortState() {
    cursor.value = -1;
    sortBy.value = null;
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
