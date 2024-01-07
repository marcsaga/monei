import { useIsMobile } from "~/hooks/use-is-mobile";
import { PieChart, type PieData } from "../pie-chart";
import { useEffect, useRef } from "react";

interface PieChartCardProps<T extends PieData> {
  title?: string;
  data: T[];
}

export function PieChartCard<T extends PieData>({
  title,
  data,
}: PieChartCardProps<T>) {
  const proportion = useIsMobile() ? 1 : 0.7;
  const pieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => {
      if (pieRef.current) {
        const newHeight = pieRef.current.offsetWidth * proportion;
        pieRef.current.style.height = `${newHeight}px`;
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="card grid h-min gap-4 pt-[18px] [&>*:last-child]:justify-self-center [&_svg]:overflow-visible">
      <span className="text-main-dark text-xl font-semibold uppercase">
        {title ?? "By category"}
      </span>
      <div className="my-4 w-full md:my-10" ref={pieRef}>
        <PieChart data={data} />
      </div>
    </div>
  );
}
