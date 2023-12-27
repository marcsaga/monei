/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getInputEditableCell } from "~/components/table";
import { Table } from "~/components/table/table";
import {
  type CategoryInputUpdateData,
  getCategoryInputCell,
  useProcessUpdateCategory,
} from "../category-input";
import { type Expense } from "~/utils/interfaces";
import {
  useCreateExpense,
  useDeleteExpenses,
  useListExpenses,
  useUpdateExpense,
} from "~/hooks/api/expenses";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";

const columnHelper = createColumnHelper<Expense>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<Expense, any>[] = [
  columnHelper.accessor("description", {
    header: () => <span>Description</span>,
    cell: (input) => getInputEditableCell<Expense>(input, "text"),
  }),
  columnHelper.accessor("amount", {
    cell: (input) => getInputEditableCell<Expense>(input, "number"),
    header: () => <span className="whitespace-nowrap">Amount €</span>,
  }),
  columnHelper.accessor("category", {
    cell: (input) => getCategoryInputCell<Expense>(input, "expense"),
    header: () => <span>Category</span>,
  }),
];

export const ExpenseTable = () => {
  const { filters } = useMonthlyFilters();
  const listExpenses = useListExpenses(filters);
  const createExpense = useCreateExpense(filters);
  const updateExpense = useUpdateExpense(filters);
  const deleteExpenses = useDeleteExpenses(filters);
  const { processUpdateCategory } = useProcessUpdateCategory("expense");

  async function handleAddRow(
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    let createValue = value;
    if (columnId === "category") {
      createValue = await processUpdateCategory(
        value as CategoryInputUpdateData,
      );
    }
    createExpense.mutate({
      [columnId === "category" ? "categoryId" : columnId]: createValue,
      date: filters.start,
    });
  }

  async function handleUpdateRow(
    rowIndex: number,
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    const expense = listExpenses.data?.[rowIndex];
    if (!expense) return;

    let updateValue = value;
    if (columnId === "category") {
      updateValue = await processUpdateCategory(
        value as CategoryInputUpdateData,
      );
    }

    if (expense[columnId] === updateValue) {
      return;
    }
    updateExpense.mutate({
      id: expense.id,
      [columnId === "category" ? "categoryId" : columnId]: updateValue,
    });
  }

  function handleDeleteRows(rowIds: string[]) {
    deleteExpenses.mutate({ ids: rowIds });
  }

  return (
    <Table
      id={`expenses-${filters.start}`}
      data={listExpenses.data ?? []}
      columns={columns}
      colSizes={["w-2/5"]}
      onUpdateData={handleUpdateRow}
      onAddRow={handleAddRow}
      onDeleteRows={handleDeleteRows}
    />
  );
};
