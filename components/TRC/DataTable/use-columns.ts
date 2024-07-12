import type { DataTableColumn } from "./data-table-types";

interface TableColumns<Field extends string> {
  colWidths: Ref<Record<string, number>>;
  cols: ComputedRef<DataTableColumn<Field>[]>; 
  colsPinned: ComputedRef<DataTableColumn<Field>[]>;
  tableWidth: ComputedRef<number>;
}

function useTableColumns<Field extends string>(columns: DataTableColumn<Field>[]): TableColumns<Field> {
  const colWidths = ref(Object.fromEntries(columns.map(({ field, width }) => [field, width])));

  const cols = computed(() => columns.filter((col) => !col.pinned));
  const colsPinned = computed(() => columns.filter((col) => col.pinned));

  const tableWidth = computed(() => columns.reduce((accum, col) => accum + col.width, 34));

  return { cols, colsPinned, colWidths, tableWidth };
}


export { useTableColumns };
export type { TableColumns };
