import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-[#fafafa] to-[#e3e3e3]">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-400">
        Welcome
      </h3>
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-400 sm:text-[5rem]">
        <span className="text-[#f8e44b]">Monei</span> App
      </h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
            onClick={() => void signIn(provider.id)}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
