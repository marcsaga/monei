import { useLocaleNumberFormatter } from "~/utils/formatters/number";
import { PercentageArrow } from "../percentage-arrow";

interface TotalCardProps {
  total: number;
  title: string;
  description: string;
  previousTotal: number;
  className?: string;
  mode?: "investment" | "expense";
}

export const TotalCard = ({
  title,
  description,
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
      <span className="text-xl font-semibold uppercase text-gray-600">
        {description}
      </span>
      <span className="ml-auto self-center text-3xl font-semibold text-gray-900">
        {formatCurrency(total)}
      </span>
      <span className="uppercase text-gray-400">{title}</span>
      <PercentageArrow
        percentage={historicPercentage}
        mode={mode}
        className="ml-auto"
      />
    </div>
  );
};
