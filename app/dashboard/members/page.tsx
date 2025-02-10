import React from "react";
import MemberTable from "./components/MemberTable";
import SearchMembers from "./components/SearchMembers";
import CreateMember from "./components/create/CreateMember";
import { useUserStore } from "@/lib/store/user";
import { createSupbaseServerClient } from "@/lib/supabase/client";

export default async function Members() {
  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata.role == "admin";

  // if (!session || session.user.user_metadata.role !== "super_admin") {
  //   redirect("/login");
  // }
  return (
    <div className="space-y-5 w-full overflow-y-auto px-3">
      <h1 className="text-3xl font-bold">Users</h1>

      {isAdmin && (
        <div className="flex gap-2">
          <SearchMembers />
          <CreateMember />
        </div>
      )}

      <MemberTable />
    </div>
  );
}
