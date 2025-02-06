"use client";
import React from "react";
import { useTheme } from "next-themes";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import FloatingNavbar from "@/app/(home)/components/FloatingNabvar";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

const News = () => {
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
          <h1 className="flex items-center xl:flex w-full gap-3">
            <IoNewspaperOutline className="text-[50px] items-center gap-3" />
            News
          </h1>
        </div>
      </div>
    </div>
  );
};

export default News;
