import { ExpenseTable } from "../../components/table/shared/expense-table";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

export default function MonthlyExpenses() {
  const { filters } = useExpenseFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const expensesList = useListExpenses(filters);
  const mostSpentCategory = useMostSpentCategoryByFilter();
  usePreLoadExpenses();

  return (
    <MonthlyLayout>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total expenses"
        total={currentTotal ?? 0}
        previousTotal={previousTotal ?? 0}
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

const initialFilters = {
  date: getFullMonthDates(dayFromDate(new Date())).start,
};

export const useExpenseFilters = () => {
  const router = useRouter();

  function handleOnMonthChange(direction: 1 | -1) {
    const date = new Date(router.query.date as string);
    date.setMonth(date.getMonth() + direction);
    const newMonthDates = getFullMonthDates(dayFromDate(date));

    void router.replace({
      query: { ...router.query, date: newMonthDates.start },
    });
  }

  useEffect(() => {
    if (Object.values(router.query).length > 0) {
      return;
    }
    void router.replace({ query: initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { start, end } = getFullMonthDates(
    router.query.date ? (router.query.date as string) : initialFilters.date,
  );

  return { filters: { start, end }, handleOnMonthChange };
};

export function usePreLoadExpenses() {
  const current = getFullMonthDates(dayFromDate(new Date()));
  const previous = getFullPreviousMonthDates(current.start);
  const next = getFullNextMonthDates(current.start);

  useListExpenses(previous);
  useListExpenses(next);
  useListExpenses(current);
}

function useMonthlyExpenseTotals() {
  const current = useExpenseFilters().filters;
  const previous = getFullPreviousMonthDates(current.start);

  const currentMonthExpense = useListExpenses(current);
  const previousMonthExpense = useListExpenses(previous);

  const calculate = (acc: number, expense: Expense) =>
    acc + (expense.amount ?? 0);
  return {
    currentTotal: currentMonthExpense.data?.reduce(calculate, 0),
    previousTotal: previousMonthExpense.data?.reduce(calculate, 0),
  };
}

function useMostSpentCategoryByFilter() {
  const { filters: current } = useExpenseFilters();
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
