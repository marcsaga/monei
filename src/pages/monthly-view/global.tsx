import { TotalCard } from "~/components/cards/totals";
import { GlobalExpensesList } from "~/components/global-expenses-list";
import { GlobalInvestmentsList } from "~/components/global-investments-list";
import { MonthlyLayout } from "~/components/layout";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import {
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/date-formatters";
import { useMonthlyExpenseTotals } from "./expenses";
import { api } from "~/utils/api";

export default function GlobalMonthly() {
  const { filters } = useMonthlyFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const { currentInvested, previousInvested } = useGetInvestedTotalValue();

  return (
    <MonthlyLayout equalColumns>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total expenses"
        total={currentTotal}
        previousTotal={previousTotal}
      />
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total value"
        total={currentInvested}
        previousTotal={previousInvested}
      />
      <GlobalExpensesList />
      <GlobalInvestmentsList />
    </MonthlyLayout>
  );
}

function useGetInvestedTotalValue() {
  const { filters: current } = useMonthlyFilters();
  const previous = getFullPreviousMonthDates(current.start);
  const currentInvestments =
    api.investment.getLatestInvestmentByCategory.useQuery({
      start: current.start,
      end: current.end,
    });
  const previousInvestments =
    api.investment.getLatestInvestmentByCategory.useQuery({
      start: previous.start,
      end: previous.end,
    });

  const calculate = (acc: number, { totalValue }: { totalValue?: number }) =>
    acc + (totalValue ?? 0);
  return {
    currentInvested: currentInvestments.data?.reduce(calculate, 0) ?? 0,
    previousInvested: previousInvestments.data?.reduce(calculate, 0) ?? 0,
  };
}

GlobalMonthly.auth = true;
