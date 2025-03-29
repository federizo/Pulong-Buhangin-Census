'use client';
import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { BsFileEarmarkBarGraph } from 'react-icons/bs';
import { FaWpforms } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import FloatingNavbar from '@/app/(home)/components/FloatingNabvar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { removeCookies } from '@/lib/actions';
import Hero from './components/Hero';
import Members from './components/members';

export default function JazCode() {
  useEffect(() => {
    const currentPath = window.location.pathname;

    if (!currentPath.startsWith('/dashboard')) {
      removeCookies();
    }
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const isLargeScreen = useMediaQuery({ query: '(mid-width: 1024px)' });

  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({
        behavior: 'smooth', // Smooth scroll animation
        block: 'start', // Align the element to the top of the viewport
      });
    }
  };

  const scrollToAbout = () => {
    if (aboutref.current) {
      aboutref.current.scrollIntoView({
        behavior: 'smooth', // Smooth scroll animation
        block: 'start', // Align the element to the top of the viewport
      });
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-y-hidden ">
      <header className="flex overflow-hidden flex-col w-full">
        <FloatingNavbar
          scrollToHero={scrollToHero}
          scrollToAbout={scrollToAbout}
        />
      </header>

      <div className="z-0 w-full h-full overflow-y-auto items-center grid-col overflow-hidden ">
        <div className="w-full" ref={heroRef}>
          <Hero />
        </div>
        <div className="px-[2rem] flex flex-col">
          <Members />
          <div ref={aboutref}>
            {/* <Map />
            <TableDetails /> */}
          </div>
          {/* <BottomDetails /> */}
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
