"use client";

import React, { useEffect, useState } from "react";
import ListOfMembers from "./ListOfMembers";
import Table from "@/components/ui/Table";
import { readMembers } from "../actions";
import { getServerSideCookies } from "../../../../lib/util/cookies";

export default function MemberTable() {
  const tableHeader = ["Name", "Role", "Joined", "Status"];
  const [isAdmin, setIsAdmin] = useState<any>();
  const [permissions, setPermission] = useState<any>();

  const fetchMembers = async () => {
    try {
      const { data: fetchedPermissions } = await readMembers();

      setPermission(fetchedPermissions);
    } catch (error) {
      console.error("Error fetching members:", error);
      return <div>Error loading members. Please try again later.</div>;
    }
    if (permissions?.length === 0) {
      return <div>No members found.</div>;
    }
  };
  useEffect(() => {
    // Get the specific cookie by name
    const getCookie = async () => {
      const session: any = await getServerSideCookies();
      const json = JSON.parse(session);

      if (json.user.user_metadata.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    getCookie()

  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  function refresh() {
    fetchMembers();
  }

  return (
    <Table headers={tableHeader} refresh={refresh}>
      <ListOfMembers isAdmin={isAdmin} permissions={permissions} />
    </Table>
  );
}
