"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image component
import { motion } from "framer-motion";
const Page: React.FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleCardClick(href: string) {
    if (isMounted) {
      router.push(href);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2 }}
      className="flex flex-wrap lg:flex lg:flex-nowrap justify-center xl:w-full h-full relative mt-20 gap-5 "
    >
      {data.map((item, index) => (
        <div
          key={index}
          className="h-[500px] w-[320px] text-white relative group overflow-hidden hover:scale-105 duration-300 hover:bg-top border-solid border-2 border-gray-150 rounded-lg"
        >
          <Image
            src={item.imageSrc} // Use Image component
            alt={item.title1}
            width={320} // Provide width and height for optimization
            height={500}
            className="h-full w-full object-cover object-bottom absolute group-hover:h-[800px] group-hover:object-left-top duration-300"
          />
          <div className="hover:backdrop-blur-3xl w-full h-full absolute flex flex-col duration-500 ]">
            <div className="p-7 backdrop-blur-[2px] bg-black bg-opacity-[3px]">
              <label
                className={`font-bold text-[2rem] uppercase ${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? "text-zinc-800"
                    : "text-white"
                }`}
              >
                {item.title1}
              </label>
              <h2
                className={`font-semibold text-[2.5vh] mt-6 ${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? "text-zinc-800"
                    : "text-white"
                }`}
              >
                {item.title2}
              </h2>
            </div>

            <div className="translate-x-full group-hover:translate-x-0 duration-300 delay-100 flex flex-col justify-between h-full mt-2 text-justify backdrop-blur-sm">
              <p
                className={`px-7 w-[95%] ${
                  index === 0 || index === 1 || index === 2 || index === 3
                    ? "text-zinc-800"
                    : "text-white"
                }`}
              >
                {item.description}
              </p>
            </div>
            {/* <label
              className={`flex gap-1 text-[2vh] font-semibold w-full justify-end px-5 mb-10 items-center delay-100 translate-y-[200px] group-hover:translate-y-0 duration-300 ${index === 0 || index === 1 || index === 2 || index === 3
                ? "text-zinc-800"
                : "text-white"
                }`}
            >
              See More
            </label> */}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const data = [
  {
    title1: "PB Census",
    title2: "Pulong Buhangin Census Management System.",
    description:
      "The project PB Census is a Web-Based Census Management System that will optimize the census process by replacing manual data collection and entry with a digital solution.",
    imageSrc: "/images/CARD 1.png", // Corrected image path
  },
  {
    title1: "Census Graph",
    title2: "Pulong Buhangin Census of Population",
    description:
      "Through the PB Census Management System, personnels and officials will be able to visualize data population, sort demographics by various criteria.",
    imageSrc: "/images/CARD 2.png", // Corrected image path
  },
  {
    title1: "Digitalized Census Form",
    title2: "",
    description:
      "The digitize census management process in Barangay Pulong Buhangin will provide a more effective and reliable solution for data collection, storage, and analysis.",
    imageSrc: "/images/CARD 3.png", // Corrected image path
  },
  {
    title1: "News",
    title2: "Updates from PB Census",
    description:
      "The project PB Census is a Web-Based Census Management System that will optimize the census process by replacing manual data collection and entry with a digital solution.",
    imageSrc: "/images/CARD 4.png", // Corrected image path
  },
];
export default Page;
