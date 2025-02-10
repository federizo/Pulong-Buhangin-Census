"use client";
import React, { useEffect, useState } from "react";
import EditMember from "./edit/EditMember";
import { cn } from "@/lib/utils";
import { readMembers } from "../actions";
import DeleteMember from "./DeleteMember";


interface Data {
  isAdmin: any[], permissions: any[]
}

export default function ListOfMembers({ isAdmin, permissions }: Data) {

  return (
    <div className="dark:bg-inherit bg-white mx-2 rounded-sm">
     {permissions
  ?.filter(
    (permission: any) =>
      permission.member?.name && 
      !permission.member.name.toLowerCase().includes("super_admin")
  )

        ?.map((permission: any, index: number) => (
          <div
            className="grid grid-cols-5 rounded-sm p-3 align-middle font-normal"
            key={index}
          >
            <h1>{permission.member.name}</h1>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize border-[.5px] text-sm",
                  {
                    "border-green-500 text-green-600 bg-green-200":
                      permission.role === "admin",
                    "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                      permission.role === "user",
                  }
                )}
              >
                {permission.role === "user" ? "enumerator" : "admin"}
              </span>
            </div>
            <h1>{new Date(permission.created_at).toDateString()}</h1>
            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full capitalize text-sm border-zinc-300 border",
                  {
                    "text-green-600 px-4 dark:border-green-400 bg-green-200":
                      permission.status === "active",
                    "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                      permission.status === "resigned",
                  }
                )}
              >
                {permission.status}
              </span>
            </div>

            <div className="flex gap-2 items-center">
              {isAdmin && <DeleteMember user_id={permission.member.id} />}
              <EditMember isAdmin={isAdmin} permission={permission} />
            </div>
          </div>
        ))}
    </div>
  );
}
