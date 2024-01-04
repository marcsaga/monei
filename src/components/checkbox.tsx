interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  icon?: "line" | "tick";
}

export const Checkbox = ({
  checked,
  onChange,
  className,
  icon = "tick",
}: CheckboxProps) => {
  return (
    <div className={`flex ${className}`}>
      <label
        className="relative flex cursor-pointer items-center rounded-full"
        htmlFor="yellow"
      >
        <input
          type="checkbox"
          className="before:content[''] checked:border-main-primary checked:bg-main-primary checked:before:bg-main-primary peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-gray-300 before:opacity-0 before:transition-opacity"
          id="yellow"
          checked={checked}
          onChange={(event) => onChange?.(event.target.checked)}
          onKeyDown={(event) =>
            event.key === "Enter" ? onChange?.(!checked) : undefined
          }
        />
        <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
          {icon === "tick" ? <TickSVG /> : <LineSVG />}
        </span>
      </label>
    </div>
  );
};

const LineSVG = () => {
  return (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M6 12h12"
      />
    </svg>
  );
};

const TickSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
