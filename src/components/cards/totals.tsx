import { useLocaleNumberFormatter } from "~/utils/formatters/number";
import { PercentageArrow } from "../percentage-arrow";

interface TotalCardProps {
  total: number;
  title: string;
  subtitle: string;
  previousTotal: number;
  className?: string;
  mode?: "investment" | "expense";
}

export const TotalCard = ({
  title,
  subtitle,
  total,
  previousTotal,
  mode = "expense",
  className = "",
}: TotalCardProps) => {
  const { formatCurrency } = useLocaleNumberFormatter();
  const historicPercentage =
    previousTotal > 0
      ? Math.round(((total - previousTotal) / previousTotal) * 10000) / 100
      : 0;

  return (
    <div
      className={`card grid w-full grid-cols-[1fr_auto] items-center justify-between gap-1 ${className}`}
    >
      <span className="text-main-dark text-base font-semibold uppercase md:text-xl">
        {title}
      </span>
      <span className="text-main-dark ml-auto self-center text-xl font-semibold md:text-3xl">
        {formatCurrency(total)}
      </span>
      <span className="text-main-dark text-sm font-medium uppercase text-opacity-50 md:text-base">
        {subtitle}
      </span>
      <PercentageArrow
        percentage={historicPercentage}
        mode={mode}
        className="ml-auto"
      />
    </div>
  );
};
