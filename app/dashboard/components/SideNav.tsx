import React from "react";
import NavLinks from "./NavLinks";
import { cn } from "@/lib/utils";
import ModeToggle from "./ToggleDarkMode";
import SignOut from "./SignOut";
import { IoPersonSharp } from "react-icons/io5";

export default function SideNav({
  isAdmin,
  userSession,
}: {
  isAdmin: boolean;
  userSession: any;
}) {
  return (
    <>
      <SideBar
        className=" hidden lg:block dark:bg-graident-dark flex-1"
        isAdmin={isAdmin}
        userSession={userSession}
      />
    </>
  );
}

export const SideBar = ({
  className,
  isAdmin,
  userSession,
}: {
  className?: string;
  isAdmin: boolean;
  userSession: any;
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          "h-full w-full lg:w-96 lg:p-10 space-y-5 lg:border-r shadow-2xl flex flex-col overflow-auto"
        )}
      >
        <div className="flex-1 space-y-5">
          <div className="flex items-center gap-2 flex-1 relative">
            <h1 className="text-3xl font-bold">PB Census</h1>
            <ModeToggle />
          </div>

          <NavLinks isAdmin={isAdmin} />
        </div>

        <div className="flex items-center gap-2 ">
          <div className="h-10 w-10 rounded-full border-[1px] border-slate-500 items-center justify-center flex">
            <IoPersonSharp className="text-[20px] text-slate-400" />
          </div>
          <div className="flex flex-col">
            <label className="uppercase font-medium">
              {userSession?.session?.user?.user_metadata?.agent_name}
            </label>
            <label className="font-light tracking-wider"></label>
            {/* {userSession?.session?.user?.user_metadata?.agent_id} */}
          </div>
        </div>

        <SignOut />
      </div>
    </div>
  );
};
