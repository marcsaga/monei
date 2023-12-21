import { IconShoppingcart } from "~/components/icon";
import { MainLayout, PageLayout } from "~/components/layout";
import { ExpenseTable } from "../../components/table/shared/expense-table";
import { ArrowFilter } from "~/components/arrow-filter";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dayFromDate, getMonthName } from "~/utils/formatters";

export default function Expenses() {
  const { filters, handleOnMonthChange } = useExpenseFilters();

  return (
    <MainLayout>
      <PageLayout title="Expenses" icon={<IconShoppingcart />}>
        <div className="grid gap-10">
          <ArrowFilter
            currentFilter={getMonthName(new Date(filters.start))}
            onArrowClick={handleOnMonthChange}
          />
          <ExpenseTable />
        </div>
      </PageLayout>
    </MainLayout>
  );
}

export const useExpenseFilters = () => {
  const router = useRouter();

  function handleOnMonthChange(direction: 1 | -1) {
    const date = new Date(router.query.start as string);
    date.setMonth(date.getMonth() + direction);
    const { start, end } = generateMonthlyFilter(date);

    void router.replace({ query: { ...router.query, start, end } });
  }

  useEffect(() => {
    if (Object.values(router.query).length > 0) {
      return;
    }
    void router.replace({ query: initialFilters });
  }, []);

  return {
    filters: {
      start: (router.query.start as string) ?? initialFilters.start,
      end: (router.query.end as string) ?? initialFilters.end,
    },
    handleOnMonthChange,
  };
};

function generateMonthlyFilter(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return { start: dayFromDate(startDate), end: dayFromDate(endDate) };
}

const initialFilters = {
  start: generateMonthlyFilter(new Date()).start,
  end: generateMonthlyFilter(new Date()).end,
};
