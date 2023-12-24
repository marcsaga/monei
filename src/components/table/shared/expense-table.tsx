/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getInputEditableCell } from "~/components/table";
import { Table } from "~/components/table/table";
import { useExpenseFilters } from "~/pages/expenses";
import { api } from "~/utils/api";
import {
  type CategoryInputUpdateData,
  getCategoryInputCell,
} from "../category-input";
import { type Expense } from "~/utils/interfaces";
import {
  useCreateExpense,
  useDeleteExpenses,
  useListExpenses,
  useUpdateExpense,
} from "~/hooks/api/expenses";
import { useCreateExpenseCategory } from "~/hooks/api/categories";

const columnHelper = createColumnHelper<Expense>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<Expense, any>[] = [
  columnHelper.accessor("description", {
    header: () => <span>Description</span>,
    cell: (input) => getInputEditableCell<Expense>(input, "text"),
  }),
  columnHelper.accessor("amount", {
    cell: (input) => getInputEditableCell<Expense>(input, "number"),
    header: () => <span>Amount</span>,
  }),
  columnHelper.accessor("category", {
    cell: (input) => getCategoryInputCell<Expense>(input, "expense"),
    header: () => <span>Category</span>,
  }),
];

export const ExpenseTable = () => {
  const { filters } = useExpenseFilters();
  const listExpenses = useListExpenses(filters);
  const createExpense = useCreateExpense(filters);
  const updateExpense = useUpdateExpense(filters);
  const deleteExpense = useDeleteExpenses(filters);
  const createCategory = useCreateExpenseCategory();

  function handleAddRow(columnId: keyof Omit<Expense, "id">, value: unknown) {
    createExpense.mutate({ [columnId]: value, date: filters.start });
  }

  async function handleUpdateRow(
    rowIndex: number,
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    const expense = listExpenses.data?.[rowIndex];
    if (!expense) return;

    let currentExpenseValue = expense[columnId];
    let updateValue = value;
    if (columnId === "category") {
      currentExpenseValue = expense.category?.id;
      const categoryUpdate = value as CategoryInputUpdateData;
      if (categoryUpdate.type === "create") {
        const category = await createCategory.mutateAsync({
          name: categoryUpdate.name,
          color: categoryUpdate.color,
        });
        updateValue = category.id;
      } else {
        updateValue = categoryUpdate.id;
      }
    }

    if (currentExpenseValue === updateValue) {
      return;
    }
    updateExpense.mutate({
      id: expense.id,
      [columnId === "category" ? "categoryId" : columnId]: updateValue,
    });
  }

  function handleDeleteRows(rowIds: string[]) {
    deleteExpense.mutate({ ids: rowIds });
  }

  return (
    <Table
      data={listExpenses.data ?? []}
      columns={columns}
      onUpdateData={handleUpdateRow}
      onAddRow={handleAddRow}
      onDeleteRows={handleDeleteRows}
    />
  );
};
