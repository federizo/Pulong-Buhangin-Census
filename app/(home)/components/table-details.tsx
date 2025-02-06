"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { IoPeopleSharp } from "react-icons/io5";
import { PiCatFill } from "react-icons/pi";

const TableDetails = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mb-[20px] mt-[20px] xl:flex flex-reverse w-full items-start  gap-10 xl:justify-center ">
      <div className="flex flex-col w-full xl:w-[50%]">
        <div className="text-justify px-10 grid gap-y-5">
          <p>
            Pulong Buhangin is a barangay in the municipality of Santa Maria, in
            the province of Bulacan. Its population as determined by the 2020
            Census was 41,218. This represented 14.22% of the total population of
            Santa Maria.
          </p>
          <p>
            Pulong Buhangin is situated at approximately 14.8705, 121.0022, in
            the island of Luzon. Elevation at these coordinates is estimated at
            56.1 meters or 184.1 feet above mean sea level.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center mt-10 gap-5">
            <Card className="border-[1px] flex gap-10 justify-between items-center p-5 xl:p-10 text-[2rem] h-[150px] bg-white dark:bg-zinc-900">
              <IoPeopleSharp className="text-[3rem]" />
              <div className="flex flex-col">
                <label>41,218</label>
                <label className="text-[15px] text-wrap">
                  Pulong Buhangin Population
                </label>
              </div>
            </Card>
            <Card className="border-[1px] flex gap-10 justify-between items-center p-5 xl:p-10 text-[2rem] h-[150px] bg-white dark:bg-zinc-900">
              {/* <PiCityFill className="text-[3rem]" /> */}

              <div className="flex flex-col">
                <label>289,820</label>
                <label className="text-[15px] text-wrap">
                  Santa Maria Total Population
                </label>
              </div>
            </Card>
          </div>
          <label className="italic font-thin text-[13px] w-full text-center ">
            Data on population, and households, are from the Philippine
            Statistics Authority.
          </label>
        </div>
      </div>
      <Card className="xl:w-fit w-full flex flex-col justify-center items-center ">
        <div className="border-b-small p-3 flex flex-col gap-2 w-fit bg-white dark:bg-zinc-900">
          <Card className="w-full border-[1px] p-2">
            Data Summary of Pulong Buhangin
          </Card>
          <div className="flex gap-10">
            <div className="grid">
              <label>Type:</label>
              <label>Island Group:</label>
              <label>Region:</label>
              <label>Province:</label>
              <label>Municipality:</label>
              <label>Postal Code:</label>
              <label>Population (2020):</label>
              <label>Philippine Major Island(s)</label>
              <label>Coordinates:</label>
              <label>Estimated Elevation:</label>
              <label>Above Sea Level:</label>
            </div>
            <div className="grid items-end underline underline-offset-1">
              <label>Barangay</label>
              <label>Luzon</label>
              <label>Central Luzon (Region III)</label>
              <label>Bulacan</label>
              <label>Santa Maria</label>
              <label>3022</label>
              <label>41,218</label>
              <label>Luzon</label>
              <label>14.8705, 121.0022   (14° 52 North, 121° 0 East)</label>
              <label>56.1 meters</label>
              <label>(184.1 feet)</label>
            </div>
          </div>
        </div>
        <label className="italic font-thin mt-1 text-[13px]">
          Summary data is from PhilAtlas.
        </label>
      </Card>
    </div>
  );
};
export default TableDetails;
