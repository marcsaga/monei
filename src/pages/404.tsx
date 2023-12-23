import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { DEFAULT_PATH } from "~/utils/constants";

export default function Custom404() {
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") return void signIn();
    void router.replace(DEFAULT_PATH);
  }, [status, router]);
}
