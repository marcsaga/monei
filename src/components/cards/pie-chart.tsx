import { PieChart, type PieData } from "../pie-chart";

interface PieChartCardProps<T extends PieData> {
  title?: string;
  data: T[];
}

export function PieChartCard<T extends PieData>({
  title,
  data,
}: PieChartCardProps<T>) {
  return (
    <div className="card grid h-min gap-4 pt-[18px] [&_svg]:overflow-visible">
      <span className="text-xl font-semibold uppercase text-gray-600">
        {title ?? "By category"}
      </span>
      <PieChart data={data} />
    </div>
  );
}
