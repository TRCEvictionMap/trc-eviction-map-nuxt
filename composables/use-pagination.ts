
interface PaginationOptions<T> {
  items: T[] | ComputedRef<T[]> | Ref<T[]>;
  page: number;
  pageSize: number;
}

function usePagination<T>(options: PaginationOptions<T>) {
 
  const _page = ref(options.page);
  const pageSize = ref(options.pageSize);

  const pageCount = computed(() =>
    Math.ceil((unref(options.items) as T[]).length / pageSize.value)
  );

  const page = computed({
    get() {
      return _page.value;
    },
    set(value) {
      _page.value = Math.min(value, pageCount.value - 1);
    },
  });

  const pageItems = computed(() => {
    const start = page.value * pageSize.value;
    const end = start + pageSize.value;
    if (isRef(options.items)) {
      return options.items.value.slice(start, end);
    }
    return options.items.slice(start, end);
  });
  


  const isPrevPage = computed(() => page.value > 0);
  const isNextPage = computed(() =>
    (page.value + 1) * pageSize.value < (unref(options.items) as T[]).length
  );

  function nextPage() {
    if (isNextPage.value) {
      page.value += 1;
    }
  }

  function prevPage() {
    if (isPrevPage.value) {
      page.value -= 1;
    }
  }

  return {
    page,
    pageSize,
    pageCount,
    pageItems,
    isNextPage,
    isPrevPage,
    nextPage,
    prevPage
  };
}

type Pagination = ReturnType<typeof usePagination>;

export { usePagination };
export type { Pagination };
