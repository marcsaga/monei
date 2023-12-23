import { ArrowDownIcon, ArrowUpIcon } from "./icon";

interface TotalCardProps {
  total: number;
  title: string;
  description: string;
  previousTotal: number;
}

export const TotalCard = ({
  title,
  description,
  total,
  previousTotal,
}: TotalCardProps) => {
  const historicPercentage =
    previousTotal > 0
      ? Math.round(((total - previousTotal) / previousTotal) * 10000) / 100
      : 0;
  const hasPostiveDifference = historicPercentage > 0;

  return (
    <div className="grid w-full grid-cols-2 items-center justify-between gap-1 rounded border border-gray-200 px-4 py-3 shadow">
      <span className="text-xl font-semibold uppercase text-gray-600">
        {description}
      </span>
      <span className="ml-auto self-center text-3xl font-semibold text-gray-900">
        {total.toFixed(2)}€
      </span>
      <span className="text-xs uppercase text-gray-400">{title}</span>
      <span
        className={`ml-auto flex items-center gap-1 text-sm font-bold ${
          hasPostiveDifference ? "text-red-500" : "text-green-500"
        }`}
      >
        {historicPercentage}%
        {hasPostiveDifference ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
      </span>
    </div>
  );
};
