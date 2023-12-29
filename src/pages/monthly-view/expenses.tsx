import { ExpenseTable } from "../../components/table/shared/expense-table";
import {
  dayFromDate,
  getFullMonthDates,
  getFullNextMonthDates,
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/date-formatters";
import { TotalCard } from "~/components/cards/totals";
import { type Expense } from "~/utils/interfaces";
import { PieChartCard } from "~/components/cards/pie-chart";
import { useListExpenses } from "~/hooks/api/expenses";
import { MonthlyLayout } from "~/components/layout";
import { useListExpenseCategories } from "~/hooks/api/categories";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";

export default function MonthlyExpenses() {
  const { filters } = useMonthlyFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const expensesList = useListExpenses(filters);
  const mostSpentCategory = useMostSpentCategory();
  usePreLoadExpenses();

  return (
    <MonthlyLayout>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total expenses"
        total={currentTotal}
        previousTotal={previousTotal}
      />
      <TotalCard
        title={mostSpentCategory?.categoryName ?? ""}
        description="Most spent"
        total={mostSpentCategory?.current ?? 0}
        previousTotal={mostSpentCategory?.previous ?? 0}
      />
      <ExpenseTable />
      <PieChartCard data={expensesList.data ?? []} />
    </MonthlyLayout>
  );
}

export function usePreLoadExpenses() {
  const current = getFullMonthDates(dayFromDate(new Date()));
  const previous = getFullPreviousMonthDates(current.start);
  const next = getFullNextMonthDates(current.start);

  useListExpenses(previous);
  useListExpenses(next);
  useListExpenses(current);
}

export function useMonthlyExpenseTotals() {
  const current = useMonthlyFilters().filters;
  const previous = getFullPreviousMonthDates(current.start);

  const currentMonthExpense = useListExpenses(current);
  const previousMonthExpense = useListExpenses(previous);

  const calculate = (acc: number, expense: Expense) =>
    acc + (expense.amount ?? 0);
  return {
    currentTotal: currentMonthExpense.data?.reduce(calculate, 0) ?? 0,
    previousTotal: previousMonthExpense.data?.reduce(calculate, 0) ?? 0,
  };
}

function useMostSpentCategory() {
  const { filters: current } = useMonthlyFilters();
  const previous = getFullPreviousMonthDates(current.start);
  const currentMonthExpense = useListExpenses(current);
  const previousMonthExpense = useListExpenses(previous);

  const expenseCategories = useListExpenseCategories();

  const amountByCategory = new Map<string, number>();
  for (const expense of currentMonthExpense.data ?? []) {
    const categoryId = expense.category?.id ?? "no-category";
    const amount = amountByCategory.get(categoryId) ?? 0;
    amountByCategory.set(categoryId, amount + (expense.amount ?? 0));
  }

  const [maxCategory] = Array.from(amountByCategory.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  const previousAmount = previousMonthExpense.data
    ?.filter((e) => e.category?.id === maxCategory?.[0])
    .reduce((acc, curr) => acc + (curr.amount ?? 0), 0);

  if (!expenseCategories.data || !maxCategory) {
    return;
  }

  const categoryName =
    expenseCategories.data.find(({ id }) => id === maxCategory[0])?.name ??
    "No category";

  return {
    current: maxCategory[1],
    previous: previousAmount,
    categoryName: categoryName,
  };
}

MonthlyExpenses.auth = true;
