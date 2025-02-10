"use client";
import React, { useLayoutEffect, useState, useEffect } from "react";

// COMPONENT
import CensusCard from "./ui/census_card";
import CensusGraphPopulation from "@/components/ui_census/census_graph_population";
import CensusGraphMaleFemale from "@/components/ui_census/census_graph_male_female";
import ReactPaginate from "react-paginate";

// LIB
import { getCookies } from "@/lib/actions";
import {
  getAllHouseProfile,
  getHouseProfileByCreator,
} from "../../../lib/api/apitGET";
import moment from "moment";

// UI
import FilterDashBoard from "./ui/filter_dashboard";

// ICONS
import { FaAngleLeft, FaAngleRight, FaExpand, FaSyncAlt } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const headers = [
    "HOUSE NO.",
    "HOUSE CONTACT",
    "NO. OF MEMBERS",
    "CREATED BY",
  ];
  const [censusData, setCensusData] = useState<any[]>([]);
  const [expand, setExpand] = useState<boolean>(false);
  const [searchterm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const kmParams = searchParams.get("km")?.split(",") || [];
  const famclassParams = searchParams.get("famclass")?.split(",") || [];
  const datetoParams = searchParams.get("date_to");
  const datefromParams = searchParams.get("date_from");

  const filteredData = censusData?.filter((house) => {
    // Ensure case-insensitive search
    const houseNoMatch = house.HouseNumber?.toUpperCase().includes(searchterm.toUpperCase());
    const agentIdMatch = house.AgentId?.toUpperCase().includes(searchterm.toUpperCase());
  
    // Allow search to match either HouseNumber OR AgentId
    const searchMatch = searchterm ? (houseNoMatch || agentIdMatch) : true;
  
    // Apply other filters
    const kilometer = kmParams.length ? kmParams.includes(house.Location[0].Kilometer) : true;
    const famclass = famclassParams.length ? famclassParams.includes(house.FamClass) : true;
  
    // Date filtering
    let dateRange = true;
    if (datefromParams || datetoParams) {
      const createdAt = moment(house.created_at);
      if (datefromParams) dateRange = createdAt.isSameOrAfter(moment(datefromParams));
      if (datetoParams && dateRange) dateRange = createdAt.isSameOrBefore(moment(datetoParams));
    }
  
    return searchMatch && kilometer && famclass && dateRange;
  });
  
  const pageCount = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleFetchHouseProfile = async () => {
    try {
      const res = await getCookies();
      let response: any = [];

      if (res.user.user_metadata.role === "admin") {
        response = await getAllHouseProfile();
      } else {
        response = await getHouseProfileByCreator(res.user);
      }

      setCensusData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    handleFetchHouseProfile();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-auto">
      {!expand && (
        <div className="hidden lg:grid grid-cols-2 gap-4 w-full overflow-y-auto shrink-0">
          <CensusGraphMaleFemale year={2025} show={false} />
          <CensusGraphPopulation show={false} />
        </div>
      )}

      <div className="flex flex-col w-full h-full overflow-hidden mt-5 gap-4 relative">
        <FilterDashBoard open={filter} setOpen={setFilter} />

        <div className="flex items-center justify-between w-full px-2">
          <div className="flex gap-2 items-center">
            {!filter && (
              <button
                onClick={() => setFilter(true)}
                className="px-4 py-1 border border-zinc-800 tracking-wider duration-300 rounded-md hover:bg-blue-700 bg-blue-400"
              >
                FILTER
              </button>
            )}

            <button
              onClick={() => setExpand(!expand)}
              className="lg:flex mr-2 hidden border items-center gap-1 px-4 py-1 border-zinc-800 rounded-md hover:bg-zinc-700 duration-300 bg-gray-300 text-sm dark:bg-zinc-700 hover:dark:bg-zinc-900"
            >
              <FaExpand /> <span>Expand</span>
            </button>
          </div>

          <div className="border-[0.5px] dark:border-zinc-800 flex w-full max-w-3xl items-center px-3 rounded-md bg-slate-300 dark:bg-transparent">
            <IoIosSearch className="text-2xl" />
            <div className="h-[20px] mx-3 w-[1px] dark:bg-zinc-800 bg-black" />
            <input
  value={searchterm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // ✅ Reset to first page when searching
  }}
  type="search"
  className="w-full p-1 rounded-md bg-transparent outline-none"
  placeholder="Search by House No."
/>
          </div>

          <button
            onClick={() => handleFetchHouseProfile()}
            className="flex items-center gap-1 text-xl ml-2 text-black-500  duration-300"
          >
            <FaSyncAlt /> <span>Refresh</span>
          </button>
        </div>

        <div className="w-full flex justify-between px-2">
          <label>Family Profiles: {filteredData.length}</label>
        </div>

        <div className="flex flex-col h-full w-full gap-1 overflow-y-auto">
          <div className="rounded-t-md border-zinc-200 dark:border-zinc-800 w-full h-fit border dark:bg-gradient-dark overflow-hidden shrink-0 flex">
            <div className="grid grid-cols-5 border-b py-5 dark:border-zinc-600 w-full">
              {headers.map((header, index) => (
                <h1
                  key={index}
                  className="font-medium text-sm dark:text-gray-500 text-center"
                >
                  {header}
                </h1>
              ))}
            </div>
          </div>

          <div className="rounded-b-md border-zinc-200 dark:border-zinc-800 w-full h-full border dark:bg-gradient-dark flex flex-col">
            <div className="w-full h-full bg-white dark:bg-inherit rounded-md space-y-5 py-10">
              {censusData.length === 0 ? (
                <div className="w-full flex justify-center font-semibold tracking-widest">
                  NO DATA
                </div>
              ) : (
                paginatedData?.map((item: any, index: number) => (
                  <CensusCard key={index} item={item} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {censusData.length > 20 && (
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
