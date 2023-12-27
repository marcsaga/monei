/* eslint-disable @typescript-eslint/no-misused-promises */
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
import { Checkbox } from "../checkbox";
import { BinIcon } from "../icon";
import { useClickOutside } from "~/hooks/use-click-outside";

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
  id: string;
  data: T[];
  columns: ColumnDef<T>[];
  colSizes?: string[];
  onUpdateData: (
    rowIndex: number,
    columnId: keyof Omit<T, "id">,
    value: unknown,
  ) => void;
  onAddRow: (columnId: keyof Omit<T, "id">, value: unknown) => void;
  onDeleteRows: (rowIds: string[]) => void;
}

interface BaseRow {
  id: string;
}

export function Table<T extends Partial<BaseRow>>({
  id,
  data,
  columns,
  colSizes,
  onUpdateData,
  onAddRow,
  onDeleteRows,
}: TableProps<T>) {
  const [tableData, setTableData] = React.useState<T[]>(data);
  const [isAddingRow, setIsAddingRow] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isAddingRowState = React.useRef<"adding" | "added">();

  useClickOutside(rootRef, handleOnClickOutside);
  async function handleOnClickOutside() {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    if (isAddingRowState.current === "added") {
      isAddingRowState.current = undefined;
      return;
    } else if (isAddingRowState.current === "adding") {
      setTableData((prev) => prev.filter((row) => !row.id?.includes("new")));
      setIsAddingRow(false);
    }
  }

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable<T>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (_originalRow, index) => id + "_" + index.toString(),
    meta: {
      updateData: (
        rowIndex: number,
        columnId: keyof Omit<T, "id">,
        value: unknown,
      ) => {
        if (rowIndex === tableData.length - 1 && isAddingRow) {
          if (value) onAddRow(columnId, value);
          setIsAddingRow(false);
          isAddingRowState.current = "added";
        } else {
          onUpdateData(rowIndex, columnId, value);
        }
      },
    },
  });

  function handleAddRow() {
    setIsAddingRow(true);
    isAddingRowState.current = "adding";
    setTableData([...tableData, { id: "new" + Math.random().toString() } as T]);
  }

  const isSomeRowSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  function getMainCheckBoxTick() {
    if (table.getIsAllRowsSelected()) {
      return "tick";
    } else if (table.getIsSomeRowsSelected()) {
      return "line";
    }
  }

  function handleDeleteRows() {
    const rowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)
      .filter((id): id is string => id !== undefined);
    onDeleteRows(rowIds);
    table.toggleAllRowsSelected(false);
  }

  return (
    <div ref={rootRef}>
      {isSomeRowSelected ? (
        <TableMenu
          selectedCount={table.getSelectedRowModel().rows.length}
          onDelete={handleDeleteRows}
        />
      ) : null}
      <table className="w-full table-fixed rounded border-none bg-white shadow">
        <colgroup>
          <col className="w-[56px]" />
          {colSizes?.map((size, index) => <col key={index} className={size} />)}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="h-10 bg-gray-200 [&>:first-child]:rounded-tl [&>:last-child]:rounded-tr"
            >
              <th className="group" tabIndex={0}>
                <Checkbox
                  checked={isSomeRowSelected}
                  className={`${
                    !isSomeRowSelected ? "hidden" : ""
                  } px-4 group-hover:flex`}
                  onChange={() => table.toggleAllRowsSelected()}
                  icon={getMainCheckBoxTick()}
                />
              </th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const selectedRow = row.getIsSelected();
            const rowColor = selectedRow
              ? "bg-[hsl(53,100%,70%)]/10"
              : "hover:bg-gray-50";
            return (
              <tr
                key={row.id}
                className={`${rowColor} border-b border-gray-100`}
              >
                <td className="group">
                  <Checkbox
                    checked={selectedRow}
                    onChange={row.toggleSelected}
                    className={`${
                      !selectedRow ? "hidden" : ""
                    } py-4 pl-4 group-hover:flex`}
                  />
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="h-14 whitespace-nowrap p-0 [&>*]:px-4 [&>*]:text-sm [&>*]:font-medium [&>*]:text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-100 hover:bg-gray-100">
            <td
              colSpan={columns.length + 1}
              className="h-10 text-xs font-bold text-gray-400"
            >
              <button
                className="h-full w-full px-6 text-left uppercase"
                onClick={handleAddRow}
              >
                Add
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

interface TableMenuProps {
  selectedCount: number;
  onDelete: () => void;
}

const TableMenu = ({ selectedCount, onDelete }: TableMenuProps) => {
  return (
    <div className="sticky top-0 z-10 -mt-12 mb-2 flex h-10 w-full items-center justify-between rounded bg-white px-8 shadow">
      <span className="text-gray-500">{selectedCount} selected</span>
      <button className="-m-2 p-2" onClick={onDelete}>
        <BinIcon className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};
