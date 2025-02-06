// ClientLayout.tsx (Client Component)
"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import SideNav from "./components/SideNav";
import ToggleSidebar from "./components/ToggleSidebar";
import MobileSideNav from "./components/MobileSideNav";

interface ClientLayoutProps {
    isAdmin: boolean;
    children: ReactNode;
    userSession: any;
}

export default function ClientLayout({ isAdmin, children, userSession }: ClientLayoutProps) {
    const pathname = usePathname(); // Client-side hook

    // Restricted routes for non-admin users
    const restrictedRoutes = ["/dashboard/familyprofile", "/dashboard/graph"];

    // Redirect unauthorized users
    if (!isAdmin && restrictedRoutes.includes(pathname)) {
        redirect("/unauthorized");
    }

    return (
        <div className="w-full h-full flex overflow-hidden">
            <>
                <SideNav isAdmin={isAdmin} userSession={userSession} />
                <MobileSideNav isAdmin={isAdmin} userSession={userSession} />
            </>

            <div className="w-full h-full p-5 gap-2 flex flex-col">

                <ToggleSidebar />
                {children}
            </div>
        </div>
    );
}
