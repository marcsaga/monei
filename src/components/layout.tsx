import Link from "next/link";
import { ArrowFilter } from "./arrow-filter";
import { getMonthName } from "~/utils/formatters/date";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";
import { UserDropdown } from "./user-dropdown";
import { NavigationMenu } from "./navigation-menu";
import { DEFAULT_PATH } from "~/utils/constants";
import { useIsMobile } from "~/hooks/use-is-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  return (
    <div className="bg-main-primary layout-x-padding w-full">
      <div className="layout-max-width mx-auto grid h-max w-full grid-cols-[1fr_3fr_1fr] items-center justify-between gap-8 py-4">
        <Link href={DEFAULT_PATH}>
          <span className="text-main-light text-5xl font-bold">
            {isMobile ? "M.io" : "Monei.io"}
          </span>
        </Link>
        <NavigationMenu
          className="mx-auto max-w-none text-lg [&_ul]:gap-4 md:[&_ul]:gap-20"
          items={[
            { name: "Summary", linkBase: "/summary" },
            {
              name: "Monthly view",
              linkBase: "/monthly-view",
              linkSuffix: "/global",
            },
          ]}
        />
        <UserDropdown className="justify-self-end" />
      </div>
    </div>
  );
};

export const MainLayout = (props: { children: React.ReactNode }) => {
  return (
    <main className="m-auto grid h-screen min-h-screen w-full grid-rows-[auto_1fr]">
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
    <div className="bg-main-light grid grid-rows-[auto_1fr] overflow-hidden pt-4">
      <div className="layout-x-padding">
        <div className="layout-max-width relative z-10 mx-auto flex w-full flex-col justify-between gap-y-2 border-b border-gray-300 py-5 shadow-sm md:flex-row md:items-center">
          <NavigationMenu
            items={[
              { name: "Global", linkBase: `${base}/global` },
              { name: "Expenses", linkBase: `${base}/expenses` },
              { name: "Investments", linkBase: `${base}/investments` },
            ]}
          />
          <ArrowFilter
            className="self-end"
            currentFilter={getMonthName(filters.start)}
            onArrowClick={handleOnMonthChange}
          />
        </div>
      </div>
      <div className="layout-x-padding h-full overflow-y-auto overflow-x-hidden">
        <div
          className={`m-auto grid ${
            equalColumns ? "md:grid-cols-2" : "md:grid-cols-[1fr_425px]"
          }  layout-max-width gap-x-10 gap-y-8 py-10 pb-16 md:gap-y-16`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
