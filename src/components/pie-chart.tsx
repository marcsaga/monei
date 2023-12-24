import { Pie } from "@nivo/pie";
import _ from "lodash";
import { type Category } from "~/utils/interfaces";
import { TagComponent, hexColorDict } from "./tag";

export interface PieData {
  id: string;
  category?: Category;
  amount?: number;
}

interface PieChartProps<T> {
  data: T[];
}

export function PieChart<T extends PieData>({ data }: PieChartProps<T>) {
  const groupedData = _.groupBy(data, "category.id");
  const total = data.reduce((acc, curr) => acc + (curr.amount ?? 0), 0);
  const pieData = Object.entries(groupedData)
    .map(([key, subgroup]) => {
      const amount = subgroup.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0,
      );
      return {
        id: key ?? "No category",
        label: subgroup[0]?.category?.name ?? "No category",
        value: Math.round(amount * 100) / 100,
        color: subgroup[0]?.category?.color,
        percentage: Math.round((amount / total) * 100),
      };
    })
    .filter((e) => e.value > 0);

  return (
    <Pie
      data={pieData}
      width={450}
      height={400}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      cornerRadius={2}
      colors={({ data }) => hexColorDict[data.color ?? "no-category"]}
      borderWidth={1}
      borderColor={{ from: "color" }}
      sortByValue
      arcLinkLabelsSkipAngle={12}
      arcLabelsSkipAngle={12}
      arcLabel={(e) => `${e.value}€`}
      arcLinkLabel={(e) => e.data.label}
      animate={false}
      activeOuterRadiusOffset={4}
      activeInnerRadiusOffset={4}
      arcLinkLabelsThickness={1.5}
      tooltip={({ datum }) => {
        return (
          <div className="card flex items-center gap-1 p-2">
            <TagComponent name={datum.data.label} color={datum.data.color} />
            <span className="ml-2 text-sm font-semibold">{datum.value}€</span>
            <span className="text-sm text-gray-500">
              ({datum.data.percentage}%)
            </span>
          </div>
        );
      }}
    />
  );
}
