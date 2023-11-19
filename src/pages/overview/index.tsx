import { signOut } from "next-auth/react";
import { Layout } from "~/components/layout";

export default function MonthView() {
  return (
    <Layout>
      <div className="container m-auto flex flex-1 flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-400 sm:text-[5rem]">
          <span className="text-[hsl(53,100%,70%)]">Monei</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-slate-400">
              <span>Hello from overview</span>
            </p>
            <button
              className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
