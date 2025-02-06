"use client"

import Hero from "@/app/(home)/components/Hero";
import FloatingNavbar from "@/app/(home)/components/FloatingNabvar";
import Footer from "@/app/(home)/components/Footer";
import CardsMappingV3 from "@/app/(home)/components/CardsV3/CardsMappingV3";
import Map from "@/app/(home)/components/map";
import TableDetails from "@/app/(home)/components/table-details";
import BottomDetails from "@/app/(home)/components/bottom-details";
import { removeCookies } from "@/lib/actions";
import { useEffect, useReducer, useRef } from "react";

export default function Home() {

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (!currentPath.startsWith('/dashboard')) {
      removeCookies();
    }
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutref = useRef<HTMLDivElement>(null);

  // Function to trigger the scroll
  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({
        behavior: "smooth",  // Smooth scroll animation
        block: "start",      // Align the element to the top of the viewport
      });
    }
  };

  const scrollToAbout = () => {
    if (aboutref.current) {
      aboutref.current.scrollIntoView({
        behavior: "smooth",  // Smooth scroll animation
        block: "start",      // Align the element to the top of the viewport
      });
    }
  };


  return (
    <div className="relative w-screen h-screen flex flex-col overflow-y-hidden ">
      <header className="flex overflow-hidden flex-col w-full">
        <FloatingNavbar scrollToHero={scrollToHero} scrollToAbout={scrollToAbout} />
      </header>

      <div className="z-0 w-full h-full overflow-y-auto items-center grid-col overflow-hidden ">
        <div className="w-full" ref={heroRef}>
          <Hero />
        </div>
        <div className="px-[2rem] flex flex-col">
          <CardsMappingV3 />
          <div ref={aboutref}>
            <Map />
            <TableDetails />
          </div>
          <BottomDetails />
        </div>
        <Footer />
      </div>
    </div>
  );
}
