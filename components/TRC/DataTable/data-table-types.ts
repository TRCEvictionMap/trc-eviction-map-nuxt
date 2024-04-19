interface DataTableColumn<Field extends string> {
  field: Field;
  headerText: string;
  headerTitle?: string;
  width?: number;
}

type DataTableRow<Field extends string> = {
  id: string;
  fields: {
    [F in Field]: number | string;
  }
}

interface RowsAndCols<Field extends string> {
  columns: DataTableColumn<Field>[];
  rows: ComputedRef<DataTableRow<Field>[]>;
}

function dataTableRowsAndCols<Field extends string>(options: RowsAndCols<Field>) {
  return options;
}

// interface DataTableProps<Field extends string> {
//   columns: DataTableColumn<Field>[];
//   rows: DataTableRow<Field>[];
// }

export { dataTableRowsAndCols };
export type { DataTableColumn, DataTableRow };
