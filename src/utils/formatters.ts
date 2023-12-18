const locale = "en-US";

const formatter = Intl.DateTimeFormat(locale, { month: "long" });

export function getMonthName(date: Date): string {
  return formatter.format(date);
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
