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
  const context = api.useContext();

  const expenseListQuery = api.expense.list.useQuery(
    { start: filters.start, end: filters.end },
    { staleTime: 60_000 },
  );
  const createExpenseMutation = api.expense.create.useMutation({
    onSuccess: () => void context.expense.list.invalidate(),
  });
  const updateExpenseMutation = api.expense.update.useMutation();
  const deleteExpenseMutation = api.expense.delete.useMutation({
    onSuccess: (_, { ids }) =>
      context.expense.list.setData(
        filters,
        (prev) => prev?.filter((expense) => !ids.includes(expense.id)),
      ),
    onMutate: ({ ids }) =>
      context.expense.list.setData(
        { start: filters.start, end: filters.end },
        (prev) => prev?.filter((expense) => !ids.includes(expense.id)),
      ),
  });
  const createCategoryMutation = api.category.createExpenseCategory.useMutation(
    {
      onSuccess: () => void context.category.listExpenseCategories.invalidate(),
    },
  );

  function handleAddRow(columnId: keyof Omit<Expense, "id">, value: unknown) {
    createExpenseMutation.mutate({ [columnId]: value, date: filters.start });
  }

  async function handleUpdateRow(
    rowIndex: number,
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    const expense = expenseListQuery.data?.[rowIndex];
    if (!expense) return;

    let currentExpenseValue = expense[columnId];
    let updateValue = value;
    if (columnId === "category") {
      currentExpenseValue = expense.category?.id;
      const categoryUpdate = value as CategoryInputUpdateData;
      if (categoryUpdate.type === "create") {
        const category = await createCategoryMutation.mutateAsync({
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
    updateExpenseMutation.mutate({
      id: expense.id,
      [columnId === "category" ? "categoryId" : columnId]: updateValue,
    });
  }

  function handleDeleteRows(rowIds: string[]) {
    deleteExpenseMutation.mutate({ ids: rowIds });
  }

  return (
    <Table
      data={expenseListQuery.data ?? []}
      columns={columns}
      onUpdateData={handleUpdateRow}
      onAddRow={handleAddRow}
      onDeleteRows={handleDeleteRows}
    />
  );
};
