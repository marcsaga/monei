import Link from "next/link";
import { ArrowFilter } from "./arrow-filter";
import { getMonthName } from "~/utils/date-formatters";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { UserDropdown } from "./user-dropdown";
import { NavigationMenu } from "./navigation-menu";

const Navbar = () => {
  return (
    <div className="w-full bg-[hsl(53,100%,70%)]/20 px-12">
      <div className="relative mx-auto flex h-max w-full items-center justify-between gap-24 py-4 lg:max-w-7xl">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <span className="text-5xl font-bold text-[hsl(53,100%,70%)]">
            Monei
          </span>
        </Link>
        <NavigationMenu
          className="absolute w-full max-w-none text-lg [&_ul]:gap-20"
          items={[
            { name: "Summary", linkBase: "/summary" },
            {
              name: "Monthly view",
              linkBase: "/monthly-view",
              linkSuffix: "/global",
            },
          ]}
        />
        <UserDropdown />
      </div>
    </div>
  );
};

export const MainLayout = (props: { children: React.ReactNode }) => {
  return (
    <main className="m-auto grid h-screen min-h-screen w-full md:grid-rows-[auto_1fr]">
      <Navbar />
      {props.children}
    </main>
  );
};

interface MonthlyLayoutProps {
  children: React.ReactNode;
  equalColumns?: boolean;
}

export const MonthlyLayout = ({
  children,
  equalColumns,
}: MonthlyLayoutProps) => {
  const base = "/monthly-view";
  const { filters, handleOnMonthChange } = useMonthlyFilters();

  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden pt-4">
      <div className="relative z-10 mx-auto flex w-full items-center justify-between border-b border-gray-300 py-5 shadow-sm lg:max-w-7xl">
        <NavigationMenu
          items={[
            { name: "Global", linkBase: `${base}/global` },
            { name: "Expenses", linkBase: `${base}/expenses` },
            { name: "Investments", linkBase: `${base}/investments` },
          ]}
        />
        <ArrowFilter
          currentFilter={getMonthName(filters.start)}
          onArrowClick={handleOnMonthChange}
        />
      </div>
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div
          className={`m-auto grid ${
            equalColumns ? "grid-cols-2" : "grid-cols-[1fr_425px]"
          }  gap-x-10 gap-y-16 py-10 pb-16 lg:max-w-7xl`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
