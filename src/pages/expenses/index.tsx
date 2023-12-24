import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { ExpenseTable } from "../../components/table/shared/expense-table";
import { ArrowFilter } from "~/components/arrow-filter";
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

export default function Expenses() {
  const { filters, handleOnMonthChange } = useExpenseFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const expensesList = useListExpenses(filters);

  usePreLoadExpenses();

  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <div className="grid gap-10 py-16">
          <ArrowFilter
            currentFilter={getMonthName(filters.start)}
            onArrowClick={handleOnMonthChange}
          />
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <ExpenseTable />
            <div className="mt-6 flex flex-col gap-4">
              <TotalCard
                title={getMonthName(filters.start)}
                description="Total expenses"
                total={currentTotal ?? 0}
                previousTotal={previousTotal ?? 0}
              />
              <PieChartCard data={expensesList.data ?? []} />
            </div>
          </div>
        </div>
      </PageLayout>
    </MainLayout>
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
  const { filters: current } = useExpenseFilters();
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

Expenses.auth = true;
