"use client";
import React from "react";
import { useTheme } from "next-themes";
import { FaWpforms } from "react-icons/fa";
import FloatingNavbar from "@/app/(home)/components/FloatingNabvar";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

const PBCensus = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-y-hidden">

      <div className="xl:flex grid gap-2 w-full py-10 border-t-[1px] border-b-[1px] xl:px-[5rem] px-[2rem] z-0 ">
        <div className="flex flex-col w-full text-[5rem] ">
          <Link
            href="/"
            className={`text-sm flex items-center gap-2 text-gray-800 dark:text-white hover:underline`}
          >
            <IoMdArrowRoundBack className="text-[40px]" />
            <span>Back</span>
          </Link>
          <h1>PB Census</h1>
          <p className="xl:translate-x-1 items-center flex gap-3 text-[2rem]">
            Pulong Buhangin Census Management System
          </p>
        </div>
        <div className="flex xl:w-[50%] w-full relative "></div>
      </div>
    </div>
  );
};

export default PBCensus;
