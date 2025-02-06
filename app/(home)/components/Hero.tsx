"use client";
import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FaWpforms } from "react-icons/fa";
import { useMediaQuery } from 'react-responsive';

const Hero = () => {
  const { theme, setTheme } = useTheme();
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <div className="xl:flex grid gap-2 w-full py-10 border-t-[1px] border-b-[1px] xl:px-[5rem] px-[2rem]  ">
      <div className="flex flex-col w-full text-[5rem]">
        <motion.h1
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Pulong Buhangin
        </motion.h1>

        <motion.h1
          className="items-center flex gap-3 xl:translate-x-1/2"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: isLargeScreen ? "50%" : "0%",
            opacity: 1,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <FaWpforms className="text-[50px]" />
          Census
        </motion.h1>
      </div>
      <motion.div

        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        className="flex xl:w-[50%] w-full relative ">
        <div className="xl:absolute bottom-0 flex flex-col gap-2 text-justify">
          <div
            className={`h-[3px] w-[100px] p-[2px] ${theme === "light" ? "bg-black" : "bg-white"
              }`}
          />
          The PB Census System is a web-based platform designed to support
          census management in Barangay Pulong Buhangin, enhancing data
          collection, accuracy, and accessibility with features for data
          visualization and analysis to aid barangay officials in
          decision-making.
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
