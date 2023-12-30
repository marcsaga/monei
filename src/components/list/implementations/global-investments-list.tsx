import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { api } from "~/utils/api";
import { List } from "../list";
import { TagComponent } from "../../tag";
import { getFullPreviousMonthDates } from "~/utils/date-formatters";
import { PercentageArrow } from "../../percentage-arrow";

export const GlobalInvestmentsList = () => {
  const data = useGetInvestmentsBreakdown();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-md font-semibold uppercase text-gray-600">
          Investments breakdown (by value)
        </h4>
      </div>
      <List data={data ?? []} />
    </div>
  );
};

function useGetInvestmentsBreakdown() {
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
    previousInvestments.data?.map((item) => [item.id, item.totalValue]) ?? [],
  );

  const parsed = currentInvestments.data?.map((item) => {
    const previous = previousByCategory.get(item.id);
    const percentage = previous
      ? Math.round((((item.totalValue ?? 0) - previous) / previous) * 100)
      : 0;

    return {
      id: item.id,
      tag: <TagComponent name={item.name} color={item.color} />,
      value: (
        <div className="ml-auto flex w-min justify-end gap-1 [&>*]:text-right">
          <span className="w-20">{item.totalValue ?? 0}€</span>
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
