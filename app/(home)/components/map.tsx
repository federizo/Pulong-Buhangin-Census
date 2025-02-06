"use client";
import React from "react";

import { useTheme } from "next-themes";

const Map = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-5">
      <div className="flex items-center w-full justify-center mt-10">
        <div className="w-[70%] h-[1px] bg-slate-800" />
      </div>
      <div className="grid gap-2 w-full py-10 z-0 ">
        <div className="flex w-full text-[5rem] justify-center ">
          <h1 className=" items-center flex gap-3 text-[2rem] mb-5 font-bold">
            Pulong Buhangin Municipality of Santa Maria Province of Bulacan
          </h1>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <iframe
            height="450"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.1794139071044!2d120.9987163090051!3d14.871242792814707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397a94485c01e75%3A0xf18688980cb5553d!2sPulong%20Buhangin%20Barangay%20Hall%2C%20Santa%20Maria%2C%203022%20Bulacan!5e0!3m2!1sen!2sph!4v1730310320591!5m2!1sen!2sph"
            className="w-full lg:w-[90%] rounded-md"
          />
          <label className="mt-1 font-thin italic">
            Location of Pulong Buhangin Barangay Hall
          </label>
        </div>
      </div>
    </div>
  );
};
export default Map;
