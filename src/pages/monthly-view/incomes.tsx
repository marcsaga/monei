import { TotalCard } from "~/components/cards/totals";
import { MonthlyLayout } from "~/components/layout";
import { useExpenseFilters } from "./expenses";
import { getMonthName } from "~/utils/date-formatters";
import { PieChartCard } from "~/components/cards/pie-chart";

export default function IncomesMonthly() {
  const { filters } = useExpenseFilters();

  return (
    <MonthlyLayout>
      <TotalCard
        title={getMonthName(filters.start)}
        description="Total invested"
        total={0}
        previousTotal={0}
      />
      <TotalCard
        title={"Savings"}
        description="Most invested"
        total={0}
        previousTotal={0}
      />
      <div className="card grid h-72 w-full place-content-center">
        <span className="text-2xl font-semibold text-gray-500">
          No incomes yet
        </span>
      </div>
      <PieChartCard data={[]} />
    </MonthlyLayout>
  );
}

IncomesMonthly.auth = true;
