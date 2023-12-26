/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getInputEditableCell } from "~/components/table";
import { Table } from "~/components/table/table";
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
import { useCallback } from "react";
import { useExpenseFilters } from "~/pages/monthly-view/expenses";

export const ExpenseTable = () => {
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
  const { filters } = useExpenseFilters();
  const listExpenses = useListExpenses(filters);
  const createExpense = useCreateExpense(filters);
  const updateExpense = useUpdateExpense(filters);
  const deleteExpense = useDeleteExpenses(filters);
  const { processExpenseCategory } = useProcessExpenseCategory();

  async function handleAddRow(
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    let createValue = value;
    if (columnId === "category") {
      createValue = await processExpenseCategory(
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
      updateValue = await processExpenseCategory(
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
    deleteExpense.mutate({ ids: rowIds });
  }

  return (
    <Table
      id={`expenses-${filters.start}`}
      data={listExpenses.data ?? []}
      columns={columns}
      onUpdateData={handleUpdateRow}
      onAddRow={handleAddRow}
      onDeleteRows={handleDeleteRows}
    />
  );
};

function useProcessExpenseCategory() {
  const createCategory = useCreateExpenseCategory();
  const processExpenseCategory = useCallback(
    async (input: CategoryInputUpdateData) => {
      let response: string | null;
      if (input.type === "create") {
        const category = await createCategory.mutateAsync({
          name: input.name,
          color: input.color,
        });
        response = category.id;
      } else {
        response = input.id;
      }

      return response;
    },
    [createCategory],
  );

  return { processExpenseCategory };
}
