import { type CategoryColor } from "~/utils/interfaces";
import { CrossIcon } from "./icon";

interface TagComponentProps {
  name: string;
  color?: CategoryColor;
  onClose?: () => void;
}

// bg-color-200
export const hexColorDict: Record<CategoryColor | "no-category", string> = {
  red: "#fecaca",
  blue: "#bfdbfe",
  green: "#bbf7d0",
  yellow: "#fef08a",
  purple: "#e9d5ff",
  pink: "#fbcfe8",
  indigo: "#c7d2fe",
  teal: "#99f6e4",
  orange: "#fed7aa",
  "no-category": "#e5e7eb",
  gray: "#e5e7eb",
};

// bg-color-300
// export const hexColorDict: Record<CategoryColor | "no-category", string> = {
//   red: "#fca5a5",
//   blue: "#93c5fd",
//   green: "#86efac",
//   yellow: "#fde047",
//   purple: "#d8b4fe",
//   pink: "#f9a8d4",
//   indigo: "#a5b4fc",
//   teal: "#5eead4",
//   orange: "#fdba74",
//   "no-category": "#d1d5db",
// };

const colorMap: Record<CategoryColor | "no-category", string> = {
  red: "bg-red-200",
  blue: "bg-blue-200",
  green: "bg-green-200",
  yellow: "bg-yellow-200",
  purple: "bg-purple-200",
  pink: "bg-pink-200",
  indigo: "bg-indigo-200",
  teal: "bg-teal-200",
  orange: "bg-orange-200",
  "no-category": "bg-gray-200",
  gray: "bg-gray-200",
};

export const TagComponent = ({ name, color, onClose }: TagComponentProps) => {
  return (
    <span
      className={`flex w-min items-center gap-1 whitespace-nowrap rounded-sm px-1 py-[2px] text-xs font-semibold text-gray-500 ${
        colorMap[color ?? "no-category"]
      }`}
    >
      {name}
      {onClose && (
        <button onClick={onClose}>
          <CrossIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};
