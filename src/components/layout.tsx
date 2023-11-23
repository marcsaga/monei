import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IconHome, IconShoppingcart, IconDollarsign } from "./icon";

interface NavbarOptionProps {
  href: string;
  children: React.ReactNode;
}

const NavbarLink = (props: NavbarOptionProps) => {
  const { pathname } = useRouter();
  const isActive = pathname.includes(props.href);

  return (
    <li>
      <Link
        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 transition-all hover:bg-[hsl(53,100%,70%)]/20 ${
          isActive ? "bg-[hsl(53,100%,70%)]/20" : ""
        }`}
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const { data } = useSession();
  if (!data) return null;

  return (
    <div className="hidden border-r bg-slate-100 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <span className="text-3xl font-bold text-[hsl(53,100%,70%)]">
              Monei
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-2">
          <ul className="grid items-start gap-2 px-4 text-sm font-medium">
            <NavbarLink href="/overview">
              <IconHome className="h-4 w-4" />
              Overview
            </NavbarLink>
            <NavbarLink href="/expenses">
              <IconShoppingcart className="h-4 w-4" />
              Expenses
            </NavbarLink>
            <NavbarLink href="/incomes">
              <IconDollarsign className="h-4 w-4" />
              Incomes
            </NavbarLink>
          </ul>
        </nav>
        <div>
          <button
            className="flex w-full items-center gap-2 p-4 text-sm font-medium text-slate-400 hover:bg-slate-200 hover:text-slate-500"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export const MainLayout = (props: { children: React.ReactNode }) => {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      void router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!data) return null;

  return (
    <main className="grid h-screen min-h-screen w-full md:grid-cols-[280px_1fr]">
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
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-12 overflow-auto p-16">
        {children}
      </div>
    </div>
  );
};
