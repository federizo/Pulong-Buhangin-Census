// Layout.tsx (Server Component)
import React, { ReactNode } from "react";
import { getCookies, readUserSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import ClientLayout from "./ClientLayout";

export default async function Layout({ children }: { children: ReactNode }) {
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/auth");
  }

  const userRole = userSession.session.user?.user_metadata?.role;
  const isAdmin = userRole === "admin";

  useUserStore.setState({ user: userSession.session.user });

  return (
    <ClientLayout isAdmin={isAdmin} userSession={userSession} >
      {children}
    </ClientLayout>
  );
}
