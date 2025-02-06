"use client";

import React, { useLayoutEffect, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { getAllMembers } from "../../../lib/api/apitGET";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import MemberCard from "./ui/member_card";
import FilterList from "./ui/filter_list";
import { useSearchParams } from "next/navigation";
import { FaExpand, FaSyncAlt } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import EXCEL_LAYOUT from "@/components/ui_export/excel_format";
import PDF_LAYOUT_FAM from "@/components/ui_export/pdf_format_fam";

export default function FamilyProfile() {
  const headers = ["NAME", "GENDER", "AGE", "CIVIL STATUS", "ACTIONS"];
  const [membersData, setMembersData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchterm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 20; // Adjust items per page as needed
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const handleFetchHouseProfile = async () => {
    try {
      setMembersData([]);

      const response: any = await getAllMembers();

      setMembersData(response.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    handleFetchHouseProfile();
  }, []);

  // Parse URL parameters
  const genderParams = searchParams.get("gender")?.split(",") || [];
  const ageParams = searchParams.get("age")?.split(",") || [];
  const civilStatusParams = searchParams.get("civilStatus")?.split(",") || [];
  const occupationParams = searchParams.get("occupation")?.split(",") || [];
  const educationParams = searchParams.get("education")?.split(",") || [];
  const religionParams = searchParams.get("religion")?.split(",") || [];
  const sectorParams = searchParams.get("sector")?.split(",") || [];
  const lactatingParams = searchParams.get("lactating")?.split(",") || [];
  const familyclassParams = searchParams.get("familyclass")?.split(",") || [];
  const pwdParams = searchParams.get("pwd")?.split(",") || [];
  const spcageParams = searchParams.get("spcage");

  const filteredData = membersData?.filter((profile) => {
    const fullName = `${profile.FirstName || ""} ${profile.MiddleName || ""} ${profile.LastName || ""
      }`.toLowerCase();

    // Filter for Gender (checking male or female)
    const matchesGender = genderParams.length
      ? genderParams.includes(profile.Gender.toUpperCase())
      : true;

    // Filter for Age (based on defined ranges)
    const age = parseInt(profile.Age); // Convert age to a number for comparison
    const matchesAge = ageParams.length
      ? ageParams.some((range) => {
        switch (range.toLowerCase()) {
          case "5 below":
            return age < 5;
          case "5-10":
            return age >= 5 && age <= 10;
          case "10-21":
            return age >= 10 && age <= 21;
          case "21-50":
            return age >= 21 && age <= 50;
          case "50-80":
            return age >= 50 && age <= 80;
          case "80 above":
            return age > 80;
          default:
            return false;
        }
      })
      : true;

    const spcAge = spcageParams ? parseInt(spcageParams) === age : true;

    // Filter for Civil Status (single, married, li)
    const matchesCivilStatus = civilStatusParams.length
      ? civilStatusParams.includes(profile.CivilStatus.toUpperCase())
      : true;

    // Filter for Occupation (checking GE, PE, OFW, OTHER)
    const matchesOccupation = occupationParams.length
      ? occupationParams.includes(profile.Occupation.value.toUpperCase()) ||
      occupationParams.includes(profile.Occupation.other.toUpperCase())
      : true;

    // Filter for Education (hs, elem, college, other)
    const matchesEducation =
      educationParams.length && profile.Education
        ? educationParams.some(
          (educ) => profile.Education[educ.toLowerCase()] === true
        )
        : true;

    // Filter for Religion (RC, INC, BR, other)
    const matchesReligion = religionParams.length
      ? religionParams.includes(profile.Religion.value.toUpperCase()) ||
      religionParams.includes(profile.Religion.other.toUpperCase())
      : true;

    // Filter for Sector (sp, src, fourps)
    const matchesSector = sectorParams.length
      ? sectorParams.some(
        (sector) => profile.Sector[sector.toLowerCase()] === true
      )
      : true;

    // Filter for Lactating (true)
    const matchesLactating = lactatingParams.includes("true")
      ? profile.Lactating === "true"
      : true;

    // Filter for Family Class (low, mid, high)
    const matchesFamilyClass = familyclassParams.length
      ? familyclassParams.includes((profile.familyclass || "").toLowerCase())
      : true;

    const matchesPWD = pwdParams.includes("true")
      ? profile.Disability !== ""
      : true;

    return (
      fullName.includes(searchterm.toLowerCase()) &&
      matchesGender &&
      matchesAge &&
      matchesCivilStatus &&
      matchesOccupation &&
      matchesEducation &&
      matchesReligion &&
      matchesSector &&
      matchesLactating &&
      matchesFamilyClass &&
      matchesPWD &&
      spcAge
    );
  });

  const pageCount = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-col w-full h-fit ">
        <h1 className="text-3xl font-bold ">Family Profile</h1>
        <div className="w-full flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <EXCEL_LAYOUT item={filteredData} />
            <PDF_LAYOUT_FAM item={filteredData} />
            <label className="flex">
              Census Family Members: {filteredData.length}
            </label>
          </div>
          <button
            onClick={() => handleFetchHouseProfile()}
            className="flex items-center gap-1 text-xl ml-2 text-black-500  duration-300"
          >
            <FaSyncAlt /> <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center dark:border-zinc-900 w-full pt-2">
        {!openFilter && (
          <button
            onClick={() => setOpenFilter(true)}
            className="border-[1px] bg-blue-600 px-5 py-1 rounded-md hover:bg-blue-700 duration-300"
          >
            {openFilter ? "CLOSE" : "FILTER"}
          </button>
        )}
        <div className="border-[0.5px] dark:border-zinc-800 flex w-full items-center px-3 rounded-md bg-slate-300 dark:bg-transparent">
          <IoIosSearch className="text-2xl" />
          <div className="h-[20px] mr-3 ml-3 w-[1px] dark:bg-zinc-800 bg-black" />
          <input
            value={searchterm}
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            type="search"
            className="w-full p-1 rounded-md bg-transparent outline-none "
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="rounded-t-md border-zinc-200 dark:border-zinc-800 w-full h-auto border dark:bg-graident-dark overflow-hidden flex shrink-0">
        <div className="w-full h-full bg-white dark:bg-inherit rounded-md py-5">
          <div className="grid grid-cols-5  dark:border-zinc-600">
            {headers.map((header, index) => (
              <h1
                key={index}
                className="font-medium text-sm dark:text-gray-500 text-center truncate overflow-hidden"
              >
                {header}
              </h1>
            ))}
          </div>
        </div>
      </div>

      <div className=" lg:mb-0 mb-10 rounded-b-md border-zinc-200 dark:border-zinc-800 border dark:bg-graident-dark overflow-y-auto overflow-x-hidden flex flex-col w-full h-full  relative">
        <FilterList open={openFilter} setOpen={setOpenFilter} />
        {paginatedData.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <label className="font-semibold tracking-widest mt-10">
              NO DATA
            </label>
          </div>
        ) : (
          <>
            {paginatedData.map((item: any) => (
              <MemberCard item={item} key={item.id} />
            ))}


          </>

        )}
      </div>
      {membersData.length > 20 && (
        <div className=" bottom-0 bg-white dark:bg-zinc-900 p-2 shadow-md border-t">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            nextClassName="hover:text-blue-500"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={<FaAngleLeft />}
            previousClassName="hover:text-blue-500"
            containerClassName="flex justify-center space-x-2 items-center"
            pageClassName="border px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            activeClassName="border-[1px]  dark:bg-zinc-800"
          />
        </div>
      )}
    </div>
  );
}