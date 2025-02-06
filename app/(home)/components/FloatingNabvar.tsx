"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import census from "@/public/images/census-logo.png";
import censusInverted from "@/public/images/census-logo-black.png";
import { useTheme } from "next-themes";
import { Spiral as Hamburger } from "hamburger-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FloatingNavbar = ({
  scrollToHero,
  scrollToAbout,
}: {
  scrollToHero: () => void;
  scrollToAbout: () => void;
}) => {
  const [isClick, setisClick] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleNavbar = () => {
    setisClick(!isClick);
  };

  return (
    <>
      <nav className="w-full border-b border-b-foreground/10 h-16 bg-transparent-100 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex justify-center items-center gap-2 ">
                {theme === "dark" ? (
                  <Image
                    src={census} // Dark mode logo
                    className="h-7 w-6"
                    alt="census"
                  />
                ) : (
                  <Image
                    src={censusInverted} // Light mode logo
                    className="h-7 w-6"
                    alt="censusInverted"
                  />
                )}
                <h1>PB Census</h1>

                <ThemeSwitcher />
              </div>
            </div>
            <div className="xl:block hidden ">
              <div className="ml-4 flex items-center space-x-4">
                <button
                  onClick={() => scrollToHero()}
                  className="inline-flex items-center justify-center whitespace-nowrap  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToAbout()}
                  className="inline-flex items-center justify-center whitespace-nowrap  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                >
                  About
                </button>
              </div>
            </div>
            <div className="xl:hidden flex items-center z-50">
              <Hamburger toggled={isClick} toggle={setisClick} />
            </div>
          </div>
        </div>
      </nav>
      <motion.aside
        initial={{ width: "0px" }} // Sidebar starts off-screen
        animate={{ width: isClick ? "300px" : "0px" }}
        transition={{ type: "tween", duration: 0.5 }}
        className="absolute bg-background border-l-[1px] z-40  h-screen overflow-hidden right-0"
      >
        <div className="px-2 pt-2 pb-3 sm:px-3 mt-10">
          <button
            onClick={() => scrollToHero()}
            className="rounded-lg p-2 w-full border-[1px] dark:text-white text-black"
          >
            Home
          </button>
          <button
            onClick={() => scrollToAbout()}
            className="rounded-lg p-2 w-full border-[1px] dark:text-white text-black"
          >
            About
          </button>
        </div>
      </motion.aside>
    </>
  );
};
export default FloatingNavbar;
