import type { DataTableColumn } from "./data-table-types";

function useColumns<Field extends string>(columns: DataTableColumn<Field>[]) {
  const colWidths = ref(Object.fromEntries(columns.map(({ field, width }) => [field, width])));

  const cols = computed(() => columns.filter((col) => !col.pinned));
  const colsPinned = computed(() => columns.filter((col) => col.pinned));

  return { cols, colsPinned, colWidths };
}

export { useColumns };
