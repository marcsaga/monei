import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconHome, IconShoppingcart } from "./icon";
import { ArrowFilter } from "./arrow-filter";
import { getMonthName } from "~/utils/date-formatters";
import { useMonthlyFilters } from "~/hooks/use-monthly-filters";

interface NavbarOptionProps {
  href: string;
  children: React.ReactNode;
}

const NavbarLink = (props: NavbarOptionProps) => {
  const { pathname } = useRouter();
  const isActive = props.href
    .split("/")
    .find((subpath) => subpath && pathname.includes(subpath));

  return (
    <Link
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1 text-zinc-900 transition-all hover:bg-[hsl(53,100%,70%)]/30 ${
        isActive ? "bg-[hsl(53,100%,70%)]/30" : ""
      }`}
      href={props.href}
    >
      {props.children}
    </Link>
  );
};

const Navbar = () => {
  return (
    <div className="flex h-max w-full gap-24 border-r bg-slate-100 px-10 py-4">
      <Link className="flex items-center gap-2 font-semibold" href="#">
        <span className="text-5xl font-bold text-[hsl(53,100%,70%)]">
          Monei
        </span>
      </Link>
      <nav className="flex flex-1 justify-center gap-4 overflow-auto">
        <NavbarLink href="/summary">
          <IconHome className="h-4 w-4" />
          <span className="font-normal">Summary</span>
        </NavbarLink>
        <NavbarLink href="/monthly-view/global">
          <IconShoppingcart className="h-4 w-4" />
          <span className="font-normal">Monthly view</span>
        </NavbarLink>
      </nav>
      <div>
        <button
          className="flex w-full items-center gap-2 rounded p-4 text-sm font-medium text-slate-400 hover:bg-slate-200 hover:text-slate-500"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
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

interface PageLayoutProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const PageLayout = ({ title, icon, children }: PageLayoutProps) => {
  return (
    <div className="flex w-full flex-col overflow-hidden">
      <header className="flex items-center gap-4 border-b p-8">
        <span className="[&>*]:h-8 [&>*]:w-8">{icon}</span>
        <h2 className="text-4xl font-medium">{title}</h2>
      </header>
      <div className="flex h-full w-full flex-1 flex-col gap-6 overflow-auto px-16">
        {children}
      </div>
    </div>
  );
};

interface MonthlyLayoutProps {
  children: React.ReactNode;
}

export const MonthlyLayout = ({ children }: MonthlyLayoutProps) => {
  const base = "/monthly-view";
  const { filters, handleOnMonthChange } = useMonthlyFilters();

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="relative z-10 w-full border-b border-gray-300 shadow">
        <div className="m-auto flex w-full items-center gap-10 lg:max-w-3xl">
          <div className="flex flex-1 gap-5">
            <MenuLink text="Global" href={`${base}/global`} />
            <MenuLink text="Expenses" href={`${base}/expenses`} />
            <MenuLink text="Investments" href={`${base}/investments`} />
          </div>
          <ArrowFilter
            currentFilter={getMonthName(filters.start)}
            onArrowClick={handleOnMonthChange}
          />
        </div>
      </div>
      <div className="h-full overflow-auto">
        <div className="m-auto grid grid-cols-[1fr_425px] gap-x-10 gap-y-16 py-16 lg:max-w-6xl">
          {children}
        </div>
      </div>
    </div>
  );
};

interface MenuLinkProps {
  text: string;
  href: string;
}

const MenuLink = ({ text, href }: MenuLinkProps) => {
  const { pathname, query } = useRouter();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={{ pathname: href, query: query }}
      className={`group flex h-12 w-32 items-center justify-center ${
        isActive ? "border-b-2 border-yellow-400" : ""
      }`}
    >
      <span
        className={`text-md px-2 text-gray-300 ${
          isActive
            ? "font-semibold text-gray-600"
            : "group-hover:font-medium group-hover:text-gray-400"
        }`}
      >
        {text}
      </span>
    </Link>
  );
};
