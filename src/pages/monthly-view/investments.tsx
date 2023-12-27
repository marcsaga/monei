import { TotalCard } from "~/components/cards/totals";
import { MonthlyLayout } from "~/components/layout";
import { getMonthName } from "~/utils/date-formatters";
import { InvestmentsTable } from "~/components/table/shared/investments-table";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";

export default function IncomesMonthly() {
  const { filters } = useMonthlyFilters();

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
      <div className="col-span-2">
        <InvestmentsTable />
      </div>
    </MonthlyLayout>
  );
}

IncomesMonthly.auth = true;
