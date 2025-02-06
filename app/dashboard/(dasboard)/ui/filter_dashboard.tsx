/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";

const FilterDashBoard = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialFilters = () => {
    const initialFilters = {
      famclass: [
        { value: "low", filtername: "Low", filterstatus: false },
        { value: "mid", filtername: "Mid", filterstatus: false },
        { value: "high", filtername: "High", filterstatus: false },
      ],
      km: [
        { value: "37", filtername: "KM 37", filterstatus: false },
        { value: "38-A", filtername: "KM 38-A", filterstatus: false },
        { value: "38-B", filtername: "KM 38-B", filterstatus: false },
        {
          value: "38-POBLACION",
          filtername: "KM 38-POBLACION",
          filterstatus: false,
        },
        { value: "39", filtername: "KM 39", filterstatus: false },
        { value: "40", filtername: "KM 40", filterstatus: false },
        { value: "41", filtername: "KM 41", filterstatus: false },
        { value: "42", filtername: "KM 42", filterstatus: false },
      ],
    };

    // Parse search parameters and update filterstatus accordingly
    const params = searchParams;

    for (const [group, items] of Object.entries(initialFilters)) {
      const values = params.get(group)?.split(",") || [];
      items.forEach((item: any) => {
        if (values.includes(item.value)) {
          item.filterstatus = true;
        }
      });
    }

    return initialFilters;
  };

  const [filters, setFilters] = useState(getInitialFilters());

  const updateUrlWithFilters = () => {
    // Get current URL search parameters
    const params = new URLSearchParams(window.location.search);

    for (const [group, items] of Object.entries(filters)) {
      const selectedFilters = items
        .filter((item) => item.filterstatus)
        .map((item) => item.value);

      // Update only the selected filters in the URL
      if (selectedFilters.length > 0) {
        params.set(group, selectedFilters.join(","));
      } else {
        params.delete(group); // Remove the filter if no option is selected
      }
    }

    // Push the updated URL with the filters
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (group: keyof typeof filters, index: number) => {
    const updatedFilters = { ...filters };
    updatedFilters[group][index].filterstatus =
      !updatedFilters[group][index].filterstatus;
    setFilters(updatedFilters);

    updateUrlWithFilters();
  };

  const clearSearchParams = () => {
    const newSearchParams = new URLSearchParams();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${newSearchParams.toString()}`
    );
    window.location.reload();
  };

  const renderFilterGroup = (label: string, group: keyof typeof filters) => (
    <>
      <label className="underline underline-offset-2 shrink-0">{label}</label>
      <div className="flex flex-col gap-2">
        {filters[group].map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <Checkbox
              className="h-6 w-6"
              checked={item.filterstatus}
              onCheckedChange={() => handleFilterChange(group, idx)}
            />
            <label>{item.filtername}</label>
          </div>
        ))}
      </div>
    </>
  );

  const refDiv = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (refDiv.current && !refDiv.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={refDiv}
      className={`${!open ? "w-[0px] overflow-hidden opacity-0" : "w-[350px]"}  
        fixed top-20 left-5 h-[calc(100vh-80px)] overflow-y-auto 
        duration-300 flex flex-col gap-4 px-4 dark:bg-zinc-900 bg-white 
        py-3 rounded-md border border-zinc-800 z-50 shadow-lg`}
    >
      <button
        onClick={() => clearSearchParams()}
        className="w-full py-1 border-[1px] border-zinc-800 hover:border-red-500 hover:text-red-500 rounded-sm"
      >
        CLEAR FILTER
      </button>
      {renderFilterGroup("KILOMETER", "km")}
      {renderFilterGroup("FAMILY CLASS", "famclass")}

      <div className="w-full flex flex-col gap-2 relative ">
        <label className="underline underline-offset-2 shrink-0">DATE</label>
        <div className="flex flex-col w-full justify-center items-center gap-1">
          <input
            data-date-format="MM DD YYYY"
            type="date"
            className="w-full px-2 py-1 rounded-md"
            max={moment(new Date()).format("YYYY-MM-DD")}
            onChange={(e) => {
              const value = e.target.value;

              // Update URL with date_from
              const params = new URLSearchParams(window.location.search);
              if (value) {
                params.set("date_from", value);
              } else {
                params.delete("date_from");
              }
              router.push(`?${params.toString()}`);
            }}
          />
          <label className="font-thin tracking-widest">TO</label>
          <input
            data-date-format="MM DD YYYY"
            type="date"
            className="w-full px-2 py-1 rounded-md"
            max={moment(new Date()).format("YYYY-MM-DD")}
            onChange={(e) => {
              const value = e.target.value;

              // Update URL with date_to
              const params = new URLSearchParams(window.location.search);
              if (value) {
                params.set("date_to", value);
              } else {
                params.delete("date_to");
              }
              router.push(`?${params.toString()}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterDashBoard;
