import { useRouter } from "next/router";
import { useEffect } from "react";
import { dayFromDate, getFullMonthDates } from "~/utils/date-formatters";

const initialFilters = {
  date: getFullMonthDates(dayFromDate(new Date())).start,
};

export const useMonthlyFilters = () => {
  const router = useRouter();

  function handleOnMonthChange(direction: 1 | -1) {
    const date = new Date(router.query.date as string);
    date.setMonth(date.getMonth() + direction);
    const newMonthDates = getFullMonthDates(dayFromDate(date));

    void router.replace({
      query: { ...router.query, date: newMonthDates.start },
    });
  }

  useEffect(() => {
    if (Object.values(router.query).length > 0) {
      return;
    }
    void router.replace({ query: initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { start, end } = getFullMonthDates(
    router.query.date ? (router.query.date as string) : initialFilters.date,
  );

  return { filters: { start, end }, handleOnMonthChange };
};
