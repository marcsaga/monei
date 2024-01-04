import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { api } from "~/utils/api";
import { List } from "../list";
import { TagComponent } from "../../tag";
import { getFullPreviousMonthDates } from "~/utils/formatters/date";
import { PercentageArrow } from "../../percentage-arrow";
import { useLocaleNumberFormatter } from "~/utils/formatters/number";

export const GlobalInvestmentsList = () => {
  const data = useGetInvestmentsBreakdown();

  return <List title="Investments breakdown (by value)" data={data ?? []} />;
};

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
        <div className="ml-auto flex w-min justify-end gap-1 [&>*]:text-right">
          <span className="text-main-dark w-20">
            {formatCurrency(item.marketValue ?? 0)}
          </span>
          <div className="flex w-20 items-center">
            <PercentageArrow
              percentage={percentage}
              className="ml-auto"
              mode="investment"
            />
          </div>
        </div>
      ),
    };
  });

  return parsed;
}
