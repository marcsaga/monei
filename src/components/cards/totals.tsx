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
      <span className="text-main-dark text-xl font-semibold uppercase">
        {title}
      </span>
      <span className="text-main-dark ml-auto self-center text-3xl font-semibold">
        {formatCurrency(total)}
      </span>
      <span className="text-main-dark font-medium uppercase text-opacity-50">
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
