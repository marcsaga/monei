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
    <div className="bg-main-primary layout-x-padding w-full overflow-hidden">
      <div className="layout-max-width mx-auto grid h-max w-full grid-cols-[1fr_3fr_1fr] items-center justify-between gap-4 py-4 md:gap-8">
        <Link href={DEFAULT_PATH}>
          <span className="text-main-light text-5xl font-bold">
            {isMobile ? "M" : "Monei.io"}
          </span>
        </Link>
        <NavigationMenu
          className="mx-auto max-w-none text-base lg:text-lg [&_ul]:gap-4 md:[&_ul]:gap-20"
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
    <div className="bg-main-light flex flex-col overflow-hidden pt-4">
      <div className="layout-x-padding">
        <div className="layout-max-width relative z-10 mx-auto flex w-full flex-col justify-between gap-y-3 border-b border-gray-300 py-3 shadow-sm md:flex-row md:items-center md:py-5">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-0 md:px-8 lg:px-12">
        <div
          className={`m-auto grid ${
            equalColumns ? "md:grid-cols-2" : "md:grid-cols-[1fr_425px]"
          }  layout-max-width gap-x-10 gap-y-6 py-4 pb-16 md:gap-y-12 md:py-10 [&>*]:px-4 [&>*]:md:px-0`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
