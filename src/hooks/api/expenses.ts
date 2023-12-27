import { api } from "~/utils/api";

export interface ExpenseFilter {
  start: string;
  end: string;
}

export function useListExpenses({ start, end }: ExpenseFilter) {
  return api.expense.list.useQuery(
    { start: start, end: end },
    { staleTime: 60_000 },
  );
}

export function useUpdateExpense({ start, end }: ExpenseFilter) {
  const context = api.useContext();
  return api.expense.update.useMutation({
    onSuccess: () => void context.expense.list.invalidate({ start, end }),
  });
}

export function useCreateExpense({ start, end }: ExpenseFilter) {
  const context = api.useContext();
  return api.expense.create.useMutation({
    onSuccess: () => void context.expense.list.invalidate({ start, end }),
  });
}

export function useDeleteExpenses({ start, end }: ExpenseFilter) {
  const context = api.useContext();
  return api.expense.delete.useMutation({
    onMutate: ({ ids }) =>
      context.expense.list.setData(
        { start, end },
        (prev) => prev?.filter((expense) => !ids.includes(expense.id)),
      ),
  });
}
