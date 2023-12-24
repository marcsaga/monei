const locale = "en-US";

const formatter = Intl.DateTimeFormat(locale, { month: "long" });

export function getMonthName(date: string): string {
  return formatter.format(new Date(date));
}

export function dayFromDate(date: Date) {
  const [month, day, year] = date.toLocaleDateString(locale).split("/");
  return `${year}-${formatDateNumberPadding(month)}-${formatDateNumberPadding(
    day,
  )}`;
}

function formatDateNumberPadding(num?: string) {
  return num?.toString().padStart(2, "0") ?? "00";
}

export function getFullMonthDates(dateInput: string) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return { start: dayFromDate(startDate), end: dayFromDate(endDate) };
}

export function getFullPreviousMonthDates(dateInput: string) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return { start: dayFromDate(startDate), end: dayFromDate(endDate) };
}

export function getFullNextMonthDates(dateInput: string) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month + 1, 1);
  const endDate = new Date(year, month + 2, 0);

  return { start: dayFromDate(startDate), end: dayFromDate(endDate) };
}
