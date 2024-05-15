interface DataTableColumn<Field extends string> {
  field: Field;
  width: number;
  sort?: "asc" | "desc" | undefined;
  disableSort?: boolean; 
  pinned?: boolean;
  headerText: string;
  headerTitle?: string;
  description?: string;
}

type DataTableRow<Field extends string> = {
  id: string;
  fields: {
    [F in Field]: {
      value: number;
      text?: string;
      moe?: string | number;
      srOnly?: string;
    };
  }
}

interface RowsAndCols<Field extends string> {
  columns: DataTableColumn<Field>[];
  rows: ComputedRef<DataTableRow<Field>[]>;
}

function dataTableRowsAndCols<Field extends string>(options: RowsAndCols<Field>) {
  return {
    columns: ref(options.columns),
    rows: ref(options.rows),
  };
}

export { dataTableRowsAndCols };
export type { DataTableColumn, DataTableRow };
