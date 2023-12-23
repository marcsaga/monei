interface ArrowFilterProps {
  currentFilter: string;
  onArrowClick: (direction: -1 | 1) => void;
}

export const ArrowFilter = ({
  currentFilter,
  onArrowClick,
}: ArrowFilterProps) => {
  return (
    <div className="flex w-min items-center justify-between gap-2">
      <button
        className="rounded border border-slate-300 p-3"
        onClick={() => onArrowClick(-1)}
      >
        <ArrowLeft />
      </button>
      <button
        className="rounded border border-slate-300 p-3"
        onClick={() => onArrowClick(1)}
      >
        <ArrowRight />
      </button>
      <span className="ml-4 text-xl font-semibold uppercase text-gray-600">
        {currentFilter}
      </span>
    </div>
  );
};

const ArrowLeft = () => {
  return (
    <svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(90)"
    >
      <path d="M3 4L0 0H6L3 4Z" fill="#C4C4C4" />
    </svg>
  );
};

const ArrowRight = () => {
  return (
    <svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(-90)"
    >
      <path d="M3 4L0 0H6L3 4Z" fill="#C4C4C4" />
    </svg>
  );
};
