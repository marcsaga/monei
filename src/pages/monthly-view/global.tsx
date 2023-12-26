import { TotalCard } from "~/components/cards/totals";
import { MonthlyLayout } from "~/components/layout";
import { useExpenseFilters } from "./expenses";
import { getMonthName } from "~/utils/date-formatters";

export default function GlobalMonthly() {
  const { filters } = useExpenseFilters();

  return (
    <MonthlyLayout>
      <div className="card grid h-96 w-full place-content-center">Global</div>
      <div className="flex flex-col gap-4">
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
      </div>
    </MonthlyLayout>
  );
}

GlobalMonthly.auth = true;
