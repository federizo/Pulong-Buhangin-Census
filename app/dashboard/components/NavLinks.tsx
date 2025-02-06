"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CrumpledPaperIcon, PersonIcon } from "@radix-ui/react-icons";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { MdFamilyRestroom } from "react-icons/md";
import { CiMemoPad } from "react-icons/ci";
import { FaListUl } from "react-icons/fa";

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const links = useMemo(() => {
    const baseLinks = [
      {
        href: "/dashboard",
        text: "Dashboard",
        Icon: CrumpledPaperIcon,
      },
      {
        href: "/dashboard/members",
        text: "Users",
        Icon: PersonIcon,
      },
      {
        href: "/dashboard/form",
        text: "Census Form",
        Icon: CiMemoPad,
      },
    ];

    const adminLinks = [
      {
        href: "/dashboard/graph",
        text: "Census Graph",
        Icon: BsFileEarmarkBarGraph,
      },
      {
        href: "/dashboard/familyprofile",
        text: "Family Profile",
        Icon: MdFamilyRestroom,
      },
      {
        href: "/dashboard/log",
        text: "Log",
        Icon: FaListUl,
      },
    ];

    return isAdmin ? [...baseLinks, ...adminLinks] : baseLinks;
  }, [isAdmin]);

  return (
    <div className="space-y-5">
      {links.map((link, index) => {
        const Icon = link.Icon;
        return (
          <Link
            onClick={() => document.getElementById("sidebar-close")?.click()}
            href={link.href}
            key={index}
            className={cn("flex items-center gap-2 rounded-sm p-2", {
              "bg-blue-400 dark:bg-blue-700 text-white": pathname === link.href,
            })}
          >
            <Icon />
            {link.text}
          </Link>
        );
      })}
    </div>
  );
}
