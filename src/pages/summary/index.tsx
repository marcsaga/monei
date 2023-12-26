import { TotalCard } from "~/components/cards/totals";

export default function Summary() {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-10">
      <div className="flex flex-col gap-16">
        <div className="m-auto mt-16 grid grid-cols-[2fr_1fr] gap-x-10 gap-y-16 lg:max-w-6xl">
          <div className="card grid h-96 w-full place-content-center">
            Summary
          </div>
          <div className="flex flex-col gap-4">
            <TotalCard
              title=""
              description="Total expenses"
              total={0}
              previousTotal={0}
            />
            <TotalCard
              title=""
              description="Total incomes"
              total={0}
              previousTotal={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Summary.auth = true;
