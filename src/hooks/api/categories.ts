import { api } from "~/utils/api";
import { type ExpenseFilter } from "./expenses";
import { type CategoryType } from "~/utils/interfaces";

export function useListExpenseCategories() {
  return api.category.listExpenseCategories.useQuery({}, { staleTime: 60_000 });
}

export function useCreateExpenseCategory() {
  const context = api.useContext();
  return api.category.createExpenseCategory.useMutation({
    onSuccess: () => void context.category.listExpenseCategories.invalidate(),
  });
}

export function useListInvestmentCategories() {
  return api.category.listInvestmentCategories.useQuery(
    {},
    { staleTime: 60_000 },
  );
}

export function useCreateInvestmentCategory() {
  const context = api.useContext();
  return api.category.createInvestmentCategory.useMutation({
    onSuccess: () =>
      void context.category.listInvestmentCategories.invalidate(),
  });
}

export function useDeleteCategory(type: CategoryType, filters: ExpenseFilter) {
  const context = api.useContext();
  const listContext = context.expense.list;
  const listCategoryContext =
    type === "expense"
      ? context.category.listExpenseCategories
      : context.category.listInvestmentCategories;

  return api.category.deleteCategory.useMutation({
    onMutate: ({ id }) => {
      listCategoryContext.setData(
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
      void listCategoryContext.invalidate();
      void listContext.invalidate();
    },
  });
}
