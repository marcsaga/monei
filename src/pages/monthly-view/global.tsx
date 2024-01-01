import { TotalCard } from "~/components/cards/totals";
import { GlobalExpensesList } from "~/components/list/implementations/global-expenses-list";
import { GlobalInvestmentsList } from "~/components/list/implementations/global-investments-list";
import { MonthlyLayout } from "~/components/layout";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import {
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/formatters/date";
import { useMonthlyExpenseTotals } from "./expenses";
import { api } from "~/utils/api";

export default function GlobalMonthly() {
  const { filters } = useMonthlyFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const { currentMarketValue, previousMarketValue } =
    useGetInvestedMarketValue();

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
        total={currentMarketValue}
        previousTotal={previousMarketValue}
      />
      <GlobalExpensesList />
      <GlobalInvestmentsList />
    </MonthlyLayout>
  );
}

function useGetInvestedMarketValue() {
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

  const calculate = (acc: number, { marketValue }: { marketValue?: number }) =>
    acc + (marketValue ?? 0);
  return {
    currentMarketValue: currentInvestments.data?.reduce(calculate, 0) ?? 0,
    previousMarketValue: previousInvestments.data?.reduce(calculate, 0) ?? 0,
  };
}

GlobalMonthly.auth = true;
