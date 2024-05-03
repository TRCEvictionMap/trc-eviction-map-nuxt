
type SortFn<Item, SortBy> = (
  a: Item,
  b: Item,
  sortBy: SortBy,
  direction: SortDirection
) => number;

function useSort<SortBy, Item>(items: Item[], sortFn: SortFn<Item, SortBy>) {
  const { setSortState, sortBy, sortDirection } = useSortState<SortBy>();

  const data = computed(() => {
    if (sortBy.value) {
      return Array
        .from(items)
        .sort((a, b) => sortFn(
          a,
          b,
          sortBy.value!,
          sortDirection.value
        )
      );
    }
    return Array.from(items);
  });

  return { data, setSortState, sortBy, sortDirection };
}

export { useSort };
