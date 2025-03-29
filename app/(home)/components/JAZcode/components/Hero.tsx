'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { FaWpforms } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';
import FloatingNavbar from '../../FloatingNabvar';

const Hero = () => {
  const { theme, setTheme } = useTheme();
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <div className="xl:flex grid gap-2 w-full py-10 border-t-[1px] border-b-[1px] xl:px-[5rem] px-[2rem]  ">
      <div className="flex flex-col w-full text-[5rem]">
        <Link
          href="/"
          className={`text-sm flex items-center gap-2 text-gray-800 dark:text-white hover:underline`}
        >
          <IoMdArrowRoundBack className="text-[40px]" />
          <span>Back</span>
        </Link>
        <div className="flex items-center justify-center space-x-16 mb-4">
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex items-center"
          >
            <span className="text-[5rem] mb-2">J</span>
            <span className="text-[20px] ml-2 ">oel G. Salaria</span>
          </motion.div>

          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex items-center"
          >
            <span className="text-[5rem]">A</span>
            <span className="text-[20px] ml-2">ndrei C. Tolentino</span>
          </motion.div>

          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex items-center"
          >
            <span className="text-[5rem]">Z</span>
            <span className="text-[20px] ml-2">yan Lio Asistio</span>
          </motion.div>
        </div>

        <motion.h1
          className="items-center justify-start flex gap-3 xl:w-[82%] xl:translate-x-1/2"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: isLargeScreen ? '50%' : '0%',
            opacity: 1,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          Code
        </motion.h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 1.5 }}
        className="flex xl:w-[50%] w-full relative "
      >
        <div className="xl:absolute bottom-0 flex flex-col gap-2 text-justify">
          <div className="h-[3px] w-[100px] p-[2px] dark:bg-white bg-black " />
          The JAZ Code consists of three members of the Capstone Project of BSIT
          4-1 from the Polytechnic University of the Philippines. The letter J
          stands for Joel G. Salaria, the letter A stands for Andrei C.
          Tolentino, and the letter Z stands for Zyan Lio Asistio. This project
          was created for Pulong Buhangin Barangay to collect individual
          information for the Census.
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
