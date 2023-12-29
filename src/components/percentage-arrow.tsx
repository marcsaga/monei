import { ArrowUpIcon, ArrowDownIcon } from "./icon";

interface PercentageArrowProps {
  percentage: number;
  className?: string;
  mode?: "expense" | "investment";
}

export const PercentageArrow = ({
  percentage,
  className,
  mode = "expense",
}: PercentageArrowProps) => {
  const positive = mode === "expense" ? percentage > 0 : percentage < 0;

  return (
    <span
      className={`flex items-center gap-1 text-sm font-bold ${
        positive ? "text-red-500" : "text-green-500"
      } ${className}`}
    >
      {percentage}% {getIcon(percentage)}
    </span>
  );
};

function getIcon(percentage: number) {
  if (percentage === 0) {
    return <span className="relative bottom-[3px] h-4 w-4">&mdash;</span>;
  }

  return percentage > 0 ? (
    <ArrowUpIcon className="h-4 w-4" />
  ) : (
    <ArrowDownIcon className="h-4 w-4" />
  );
}
