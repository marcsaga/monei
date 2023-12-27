import { TotalCard } from "~/components/cards/totals";
import { GlobalExpensesList } from "~/components/global-expenses-list";
import { MonthlyLayout } from "~/components/layout";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { getMonthName } from "~/utils/date-formatters";

export default function GlobalMonthly() {
  const { filters } = useMonthlyFilters();

  return (
    <MonthlyLayout equalColumns>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total expenses"
        total={0}
        previousTotal={0}
      />
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total incomes"
        total={0}
        previousTotal={0}
      />
      <GlobalExpensesList />
    </MonthlyLayout>
  );
}

GlobalMonthly.auth = true;
