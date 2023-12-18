/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface Table<TData extends RowData> {
    options: {
      meta?: {
        updateData: (
          rowIndex: number,
          columnId: string,
          value: unknown,
        ) => void;
      };
    };
  }
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onUpdateData: (
    rowIndex: number,
    columnId: keyof Omit<T, "id">,
    value: unknown,
  ) => void;
  onAddRow: (columnId: keyof Omit<T, "id">, value: unknown) => void;
}

interface BaseRow {
  id: string;
}

export function Table<T extends Partial<BaseRow>>({
  data,
  columns,
  onUpdateData,
  onAddRow,
}: TableProps<T>) {
  const [tableData, setTableData] = React.useState<T[]>(data);
  const [isAddingRow, setIsAddingRow] = React.useState(false);

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable<T>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (
        rowIndex: number,
        columnId: keyof Omit<T, "id">,
        value: unknown,
      ) => {
        if (rowIndex === tableData.length - 1 && isAddingRow) {
          onAddRow(columnId, value);
          setIsAddingRow(false);
        } else {
          onUpdateData(rowIndex, columnId, value);
        }
      },
    },
  });

  function handleCreate() {
    setIsAddingRow(true);
    setTableData([...tableData, { id: "partial" } as T]);
  }

  return (
    <table className="w-full overflow-hidden rounded-lg bg-white shadow">
      <thead className="py-4">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="h-10 bg-gray-100">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-6 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="whitespace-nowrap [&>*]:px-6 [&>*]:py-4 [&>*]:text-sm [&>*]:font-medium [&>*]:text-gray-900"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-gray-100 hover:bg-gray-100">
          <td
            colSpan={columns.length}
            className="h-10 px-6 text-xs font-bold text-gray-400"
          >
            <button
              className="h-full w-full text-left uppercase"
              onClick={handleCreate}
            >
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
