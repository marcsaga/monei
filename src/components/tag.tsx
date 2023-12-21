import { colors, type CategoryColor } from "~/utils/interfaces";

interface TagComponentProps {
  name: string;
  color: CategoryColor;
}

export const TagComponent = ({ name, color }: TagComponentProps) => {
  const colorMap: Record<CategoryColor, string> = {
    red: "bg-red-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
    yellow: "bg-yellow-200",
    purple: "bg-purple-200",
    pink: "bg-pink-200",
    indigo: "bg-indigo-200",
    teal: "bg-teal-200",
    gray: "bg-gray-200",
  };

  return (
    <span
      className={`rounded-sm px-1 py-1 text-xs font-semibold text-gray-500 ${colorMap[color]}`}
    >
      {name}
    </span>
  );
};

export function generateTagColor() {
  return (
    colors[Math.floor(Math.random() * colors.length)] ??
    ("red" as CategoryColor)
  );
}
