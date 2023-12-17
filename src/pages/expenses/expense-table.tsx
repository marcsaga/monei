/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getInputEditableCell } from "~/components/table";
import { Table } from "~/components/table/table";
import { api } from "~/utils/api";

type Expense = {
  id: string;
  description?: string;
  amount?: number;
  date?: Date;
};

const columnHelper = createColumnHelper<Expense>();

const columns: ColumnDef<Expense, any>[] = [
  columnHelper.accessor("description", {
    header: () => "Description",
    cell: (input) => getInputEditableCell<Expense>(input, "text"),
  }),
  columnHelper.accessor("amount", {
    cell: (input) => getInputEditableCell<Expense>(input, "number"),
    header: () => <span>Amount $</span>,
  }),
  columnHelper.accessor("date", {
    header: () => "Date",
    cell: (input) => getInputEditableCell<Expense>(input, "date"),
  }),
];

export const ExpenseTable = () => {
  const context = api.useContext();
  const expenseListQuery = api.expense.list.useQuery(
    {},
    {
      staleTime: 60_000,
      select: (data) =>
        data.map((row) => ({
          ...row,
          date: row.date ? new Date(row.date) : undefined,
        })) ?? [],
    },
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
    expenseCreateMutation.mutate({ [columnId]: value } as Partial<Expense>);
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
