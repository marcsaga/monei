import { ArrowUpIcon, ArrowDownIcon } from "./icon";

interface PercentageArrowProps {
  percentage: number;
  className?: string;
}

export const PercentageArrow = ({
  percentage,
  className,
}: PercentageArrowProps) => {
  const positive = percentage > 0;

  return (
    <span
      className={`flex items-center gap-1 text-sm font-bold ${
        positive ? "text-red-500" : "text-green-500"
      } ${className}`}
    >
      {percentage}%
      {positive ? (
        <ArrowUpIcon className="h-4 w-4" />
      ) : (
        <ArrowDownIcon className="h-4 w-4" />
      )}
    </span>
  );
};
