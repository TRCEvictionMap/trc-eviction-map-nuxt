
type SortFn<Item, SortBy> = (
  a: Item,
  b: Item,
  sortBy: SortBy,
  direction: SortDirection
) => number;

function useSort<SortBy, Item>(items: ComputedRef<Item[]>, sortFn: SortFn<Item, SortBy>) {
  const { setSortState, sortBy, sortDirection } = useSortState<SortBy>();

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

  return { data, setSortState, sortBy, sortDirection };
}

export { useSort };
