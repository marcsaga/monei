import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Navbar = () => {
  const { data } = useSession();
  if (!data) return null;

  return (
    <div className="relative flex w-full flex-row items-center justify-between bg-[hsl(53,100%,70%)] px-8 py-4 shadow-md">
      <h1>
        <span className="text-[#fafafa]">Monei</span>
      </h1>
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <div className="flex flex-row items-center justify-end gap-4">
          <Link href="/month-view">
            <span className="text-[#fafafa]">Monthly view</span>
          </Link>
          <div className="h-6 border-l border-[#fafafa]" />
          <Link href="/overview">
            <span className="text-[#fafafa]">Global view</span>
          </Link>
        </div>
      </div>
      <span>{data.user.name}</span>
    </div>
  );
};

export const Layout = (props: { children: React.ReactNode }) => {
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
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#fafafa] to-[#e3e3e3]">
      <Navbar />
      {props.children}
    </main>
  );
};
