"use client";
import React, { useRef } from "react";
import { useTheme } from "next-themes";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa";
import FloatingNavbar from "@/app/(home)/components/FloatingNabvar";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

const CensusGraph = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="xl:flex relative w-screen h-screen flex flex-col overflow-y-hidden">
      {/* <FloatingNavbar /> */}
      <div className="xl:flex grid gap-2 w-full py-10 border-t-[1px] border-b-[1px] xl:px-[5rem] px-[2rem] z-0 ">
        <div className="md:flex flex-col w-full text-[5rem] ">
          <Link
            href="/"
            className={`text-sm flex items-center gap-2 text-gray-800 dark:text-white hover:underline`}
          >
            <IoMdArrowRoundBack className="text-[40px]" />
            <span>Back</span>
          </Link>
          <h1 className="flex items-center xl:flex w-full gap-3">
            <BsFileEarmarkBarGraph className="text-[50px] items-center gap-3 " />
            Census Graph
          </h1>

          <h1 className=" items-center flex gap-3 text-[2rem]">
            Pulong Buhangin Census of Population
          </h1>
        </div>
        <div className="flex xl:w-[50%] w-full relative ">
          <div className="xl:absolute bottom-0 flex flex-col gap-2 ">
            <div
              className={`h-[3px] w-[100px] p-[2px] ${
                theme === "light" ? "bg-black" : "bg-white"
              }`}
            />
            Through the PB Census Management System, personnels and officials
            will be able to visualize data population, sort demographics by
            various criteria.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CensusGraph;
