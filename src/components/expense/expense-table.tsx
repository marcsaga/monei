/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getInputEditableCell } from "~/components/table";
import { Table } from "~/components/table/table";
import { useExpenseFilters } from "~/pages/expenses";
import { api } from "~/utils/api";

type Expense = {
  id: string;
  description?: string;
  amount?: number;
  date?: string;
};

const columnHelper = createColumnHelper<Expense>();

const columns: ColumnDef<Expense, any>[] = [
  columnHelper.accessor("description", {
    header: () => "Description",
    cell: (input) => getInputEditableCell<Expense>(input, "text"),
  }),
  columnHelper.accessor("amount", {
    cell: (input) => getInputEditableCell<Expense>(input, "number"),
    header: () => <span>Amount (€)</span>,
  }),
];

export const ExpenseTable = () => {
  const { filters } = useExpenseFilters();
  const context = api.useContext();
  const expenseListQuery = api.expense.list.useQuery(
    { start: filters.start, end: filters.end },
    { staleTime: 60_000 },
  );
  const expenseCreateMutation = api.expense.create.useMutation({
    onSuccess: () => {
      void context.expense.list.invalidate();
    },
    onMutate: (expense) => {
      context.expense.list.setData({}, (prev) => [
        ...(prev ?? []),
        {
          id: "temp-id",
          amount: expense.amount ?? undefined,
          description: expense.description ?? undefined,
          date: expense.date ?? undefined,
        },
      ]);
    },
  });
  const expenseUpdateMutation = api.expense.update.useMutation({
    onSuccess: () => {
      void context.expense.list.invalidate();
    },
  });

  function handleAddRow(columnId: keyof Omit<Expense, "id">, value: unknown) {
    expenseCreateMutation.mutate({
      [columnId]: value,
      date: filters.start,
    } as Partial<Expense>);
  }

  function handleUpdateRow(
    rowIndex: number,
    columnId: keyof Omit<Expense, "id">,
    value: unknown,
  ) {
    const expense = expenseListQuery.data?.[rowIndex];
    if (!expense || expense[columnId] === value) {
      return;
    }

    expenseUpdateMutation.mutate({
      id: expense.id,
      [columnId]: value,
    } as { id: string } & Partial<Expense>);
  }

  return (
    <Table
      data={expenseListQuery.data ?? []}
      columns={columns}
      onUpdateData={handleUpdateRow}
      onAddRow={handleAddRow}
    />
  );
};
