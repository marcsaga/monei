import { TotalCard } from "~/components/cards/totals";

export default function Summary() {
  return (
    <div className="bg-main-light">
      <div className="mx-auto grid w-full max-w-7xl grid-rows-[auto_1fr] gap-10">
        <div className="m-auto mt-16 grid w-full grid-cols-[2fr_1fr] gap-x-10 gap-y-16">
          <div className="card grid h-96 w-full place-content-center">
            Summary
          </div>
          <div className="flex flex-col gap-4">
            <TotalCard
              title="Total expenses"
              subtitle=""
              total={0}
              previousTotal={0}
            />
            <TotalCard
              title="Total incomes"
              subtitle=""
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
