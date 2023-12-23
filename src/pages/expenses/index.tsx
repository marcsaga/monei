import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { ExpenseTable } from "../../components/table/shared/expense-table";
import { ArrowFilter } from "~/components/arrow-filter";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  getFullMonthDates,
  getFullNextMonthDates,
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/date-formatters";
import { TotalCard } from "~/components/card";
import { api } from "~/utils/api";
import { type Expense } from "~/utils/interfaces";

export default function Expenses() {
  const { filters, handleOnMonthChange } = useExpenseFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  usePreLoadExpenses();

  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <div className="grid gap-10 py-16">
          <ArrowFilter
            currentFilter={getMonthName(new Date(filters.start))}
            onArrowClick={handleOnMonthChange}
          />
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <ExpenseTable />
            <div className="mt-6 flex flex-col gap-4">
              <TotalCard
                title={getMonthName(new Date(filters.start))}
                description="Total expenses"
                total={currentTotal ?? 0}
                previousTotal={previousTotal ?? 0}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </MainLayout>
  );
}

const initialFilters = { date: getFullMonthDates(new Date()).start };

export const useExpenseFilters = () => {
  const router = useRouter();

  function handleOnMonthChange(direction: 1 | -1) {
    const date = new Date(router.query.date as string);
    date.setMonth(date.getMonth() + direction);
    const newMonthDates = getFullMonthDates(date);

    void router.replace({
      query: { ...router.query, date: newMonthDates.start },
    });
  }

  useEffect(() => {
    if (Object.values(router.query).length > 0) {
      return;
    }
    void router.replace({ query: initialFilters });
  }, []);

  const { start, end } = getFullMonthDates(
    router.query.date ? new Date(router.query.date as string) : new Date(),
  );

  return { filters: { start, end }, handleOnMonthChange };
};

function usePreLoadExpenses() {
  const { filters } = useExpenseFilters();
  const previous = getFullPreviousMonthDates(new Date(filters.start));
  const next = getFullNextMonthDates(new Date(filters.start));

  api.expense.list.useQuery(
    { start: previous.start, end: previous.end },
    { staleTime: 60_000 },
  );
  api.expense.list.useQuery(
    { start: next.start, end: next.end },
    { staleTime: 60_000 },
  );
}

function useMonthlyExpenseTotals() {
  const { start, end } = useExpenseFilters().filters;
  const currentMonthExpense = api.expense.list.useQuery(
    { start, end },
    { staleTime: 60_000 },
  );
  const previous = getFullPreviousMonthDates(new Date(start));
  const previousMonthExpense = api.expense.list.useQuery(
    { start: previous.start, end: previous.end },
    { staleTime: 60_000 },
  );

  const calculate = (acc: number, expense: Expense) =>
    acc + (expense.amount ?? 0);
  return {
    currentTotal: currentMonthExpense.data?.reduce(calculate, 0),
    previousTotal: previousMonthExpense.data?.reduce(calculate, 0),
  };
}
