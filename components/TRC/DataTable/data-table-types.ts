interface DataTableColumn<Field extends string> {
  field: Field;
  headerText: string;
  headerTitle?: string;
  infoText?: string;
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
  return options;
}

export { dataTableRowsAndCols };
export type { DataTableColumn, DataTableRow };
