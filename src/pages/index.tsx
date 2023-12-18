import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "~/server/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/") {
      void router.push("/overview");
    }
  }, [router, router.pathname]);

  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin" } };
  }

  return { props: {} };
}
