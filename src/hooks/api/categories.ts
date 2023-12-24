import { api } from "~/utils/api";
import { type ExpenseFilter } from "./expenses";

export function useListExpenseCategories() {
  return api.category.listExpenseCategories.useQuery({}, { staleTime: 60_000 });
}

export function useCreateExpenseCategory() {
  const context = api.useContext();
  return api.category.createExpenseCategory.useMutation({
    onSuccess: () => void context.category.listExpenseCategories.invalidate(),
  });
}

export function useDeleteExpenseCategory(
  _type: "expense" | "income",
  filters: ExpenseFilter,
) {
  const context = api.useContext();
  const listContext = context.expense.list;

  return api.category.deleteCategory.useMutation({
    onMutate: ({ id }) => {
      context.category.listExpenseCategories.setData(
        {},
        (prev) => prev?.filter((category) => category.id !== id),
      );
      listContext.setData(
        filters,
        (prev) =>
          prev?.map((obj) => ({
            ...obj,
            category: obj.category?.id === id ? undefined : obj.category,
          })),
      );
    },
    onSuccess: () => {
      void context.category.listExpenseCategories.invalidate();
      void listContext.invalidate();
    },
  });
}
