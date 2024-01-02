import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { api } from "~/utils/api";
import { List } from "../list";
import { TagComponent } from "../../tag";
import { getFullPreviousMonthDates } from "~/utils/formatters/date";
import { PercentageArrow } from "../../percentage-arrow";
import { useLocaleNumberFormatter } from "~/utils/formatters/number";

export const GlobalExpensesList = () => {
  const data = useGetExpensesByCategory();

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-md font-semibold uppercase text-gray-600">
        Expenses breakdown
      </h4>
      <List data={data ?? []} />
    </div>
  );
};

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
        <div className="ml-auto flex w-min justify-end gap-1 [&>*]:text-right">
          <span className="w-20">{formatCurrency(item.amount)}</span>
          <div className="flex w-20 items-center">
            <PercentageArrow percentage={percentage} className="ml-auto" />
          </div>
        </div>
      ),
    };
  });

  return parsedData;
}
