
type SortFn<Item, SortBy> = (
  a: Item,
  b: Item,
  sortBy: SortBy,
  direction: SortDirection
) => number;

function useSort<SortBy, Item>(
  items: ComputedRef<Item[]>,
  sortFn: SortFn<Item, SortBy>
) {
  const {
    incrementSortState,
    sortBy,
    sortDirection,
    setSortState,
    clearSortState
  } = useSortState<SortBy>();

  const data = computed(() => {
    if (sortBy.value) {
      return Array
        .from(items.value)
        .sort((a, b) => sortFn(
          a,
          b,
          sortBy.value!,
          sortDirection.value
        )
      );
    }
    return Array.from(items.value);
  });

  return {
    data,
    incrementSortState,
    sortBy,
    sortDirection,
    setSortState,
    clearSortState
  };
}

export { useSort };
