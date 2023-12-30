import { TotalCard } from "~/components/cards/totals";
import { MonthlyLayout } from "~/components/layout";
import {
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/date-formatters";
import { InvestmentTable } from "~/components/table/shared/investment-table";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { useListInvestments } from "~/hooks/api/investments";
import { type Investment } from "~/utils/interfaces";

export default function IncomesMonthly() {
  const { filters } = useMonthlyFilters();
  const invested = useMonthlyInvestedTotals();

  return (
    <MonthlyLayout>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total contributions"
        total={invested.currentTotal}
        previousTotal={invested.previousTotal}
      />
      <span />
      <div className="col-span-2">
        <InvestmentTable filters={filters} />
      </div>
    </MonthlyLayout>
  );
}

function useMonthlyInvestedTotals() {
  const current = useMonthlyFilters().filters;
  const previous = getFullPreviousMonthDates(current.start);

  const currentMonthExpense = useListInvestments(current);
  const previousMonthExpense = useListInvestments(previous);

  const calculate = (acc: number, expense: Investment) =>
    acc + (expense.contribution ?? 0);
  return {
    currentTotal: currentMonthExpense.data?.reduce(calculate, 0) ?? 0,
    previousTotal: previousMonthExpense.data?.reduce(calculate, 0) ?? 0,
  };
}

IncomesMonthly.auth = true;
