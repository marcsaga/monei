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
  onUpdateData: (rowIndex: number, columnId: string, value: unknown) => void;
  onAddRow: () => void;
}

export function Table<T extends object>({
  data,
  columns,
  onUpdateData,
  onAddRow,
}: TableProps<T>) {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData: onUpdateData },
  });

  return (
    <table className="w-full">
      <thead className="pb-4">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-b-slate-200 bg-slate-200 py-1 text-left"
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="py-1">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={columns.length} className="py-1">
            <button
              className="w-full bg-slate-200 text-left"
              onClick={onAddRow}
            >
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
