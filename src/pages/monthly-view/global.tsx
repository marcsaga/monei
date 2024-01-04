import { TotalCard } from "~/components/cards/totals";
import { MonthlyLayout } from "~/components/layout";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import {
  getFullPreviousMonthDates,
  getMonthName,
} from "~/utils/formatters/date";
import { useMonthlyExpenseTotals } from "./expenses";
import { api } from "~/utils/api";
import { useLocaleNumberFormatter } from "~/utils/formatters/number";
import { TagComponent } from "~/components/tag";
import { List, ListValue } from "~/components/list";

export default function GlobalMonthly() {
  const { filters } = useMonthlyFilters();
  const { currentTotal, previousTotal } = useMonthlyExpenseTotals();
  const { currentMarketValue, previousMarketValue } =
    useGetInvestedMarketValue();

  const expensesListData = useGetExpensesByCategory();
  const investmentListData = useGetInvestmentsBreakdown();

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
      <List title="Expenses breakdown" data={expensesListData} />
      <List
        title="Investments breakdown (by value)"
        data={investmentListData}
      />
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

function useGetExpensesByCategory() {
  const { formatCurrency } = useLocaleNumberFormatter();
  const { filters: current } = useMonthlyFilters();
  const previous = getFullPreviousMonthDates(current.start);
  const expensesByCategory = api.expense.expensesByCategory.useQuery({
    start: current.start,
    end: current.end,
  });
  const previousExpensesByCategory = api.expense.expensesByCategory.useQuery({
    start: previous.start,
    end: previous.end,
  });
  const previousByCategory = new Map(
    previousExpensesByCategory.data?.map((item) => [item.id, item.amount]) ??
      [],
  );

  const parsedData = expensesByCategory.data?.map((item) => {
    const previous = previousByCategory.get(item.id);
    const percentage = previous
      ? Math.round(((item.amount - previous) / previous) * 100)
      : 0;

    return {
      id: item.id,
      tag: <TagComponent name={item.name} color={item.color} />,
      value: (
        <ListValue
          value={formatCurrency(item.amount ?? 0)}
          percentage={percentage}
        />
      ),
    };
  });

  return parsedData ?? [];
}

function useGetInvestmentsBreakdown() {
  const { formatCurrency } = useLocaleNumberFormatter();
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
  const previousByCategory = new Map(
    previousInvestments.data?.map((item) => [item.id, item.marketValue]) ?? [],
  );

  const parsed = currentInvestments.data?.map((item) => {
    const previous = previousByCategory.get(item.id);
    const percentage = previous
      ? Math.round((((item.marketValue ?? 0) - previous) / previous) * 100)
      : 0;

    return {
      id: item.id,
      tag: <TagComponent name={item.name} color={item.color} />,
      value: (
        <ListValue
          value={formatCurrency(item.marketValue ?? 0)}
          percentage={percentage}
          isInvestment
        />
      ),
    };
  });

  return parsed ?? [];
}

GlobalMonthly.auth = true;
