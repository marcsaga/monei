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
import { PieChartCard } from "~/components/cards/pie-chart";

export default function IncomesMonthly() {
  const { filters } = useMonthlyFilters();
  const contributions = useMonthlyContributions();
  const marketValue = useMonthlyMarketValue();
  const pieChartData = usePieChartData();

  return (
    <MonthlyLayout>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total contributions"
        total={contributions.current}
        previousTotal={contributions.previous}
        mode="investment"
      />
      <TotalCard
        title={getMonthName(filters.start)}
        description="Market value"
        total={marketValue.current}
        previousTotal={marketValue.previous}
        mode="investment"
      />
      <InvestmentTable filters={filters} />
      <PieChartCard title="Market value breakdown" data={pieChartData} />
    </MonthlyLayout>
  );
}

function useMonthlyContributions() {
  const current = useMonthlyFilters().filters;
  const previous = getFullPreviousMonthDates(current.start);

  const currentInvestments = useListInvestments(current);
  const previousInvestments = useListInvestments(previous);

  const calculate = (acc: number, expense: Investment) =>
    acc + (expense.contribution ?? 0);
  return {
    current: currentInvestments.data?.reduce(calculate, 0) ?? 0,
    previous: previousInvestments.data?.reduce(calculate, 0) ?? 0,
  };
}

function useMonthlyMarketValue() {
  const current = useMonthlyFilters().filters;
  const previous = getFullPreviousMonthDates(current.start);

  const currentInvestments = useListInvestments(current);
  const previousInvestments = useListInvestments(previous);

  const calculate = (acc: number, expense: Investment) =>
    acc + (expense.marketValue ?? 0);
  return {
    current: currentInvestments.data?.reduce(calculate, 0) ?? 0,
    previous: previousInvestments.data?.reduce(calculate, 0) ?? 0,
  };
}

function usePieChartData() {
  const current = useMonthlyFilters().filters;
  const { data } = useListInvestments(current);

  if (!data) return [];

  return data.map((investment) => ({
    id: investment.id,
    category: investment.category,
    amount: investment.marketValue,
  }));
}

IncomesMonthly.auth = true;
