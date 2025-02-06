/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const FilterList = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [spcage, setSpcage] = useState("");
  const getInitialFilters = () => {
    const initialFilters = {
      gender: [
        { value: "MALE", filtername: "Male", filterstatus: false },
        { value: "FEMALE", filtername: "Female", filterstatus: false },
      ],
      age: [
        { value: "5 below", filtername: "5 Below", filterstatus: false },
        { value: "5-10", filtername: "5-10", filterstatus: false },
        { value: "10-21", filtername: "10-21", filterstatus: false },
        { value: "21-50", filtername: "21-50", filterstatus: false },
        { value: "50-80", filtername: "50-80", filterstatus: false },
        { value: "80 above", filtername: "80 Above", filterstatus: false },
      ],
      civilStatus: [
        { value: "SINGLE", filtername: "Single", filterstatus: false },
        { value: "MARRIED", filtername: "Married", filterstatus: false },
        { value: "LI", filtername: "Li", filterstatus: false },
      ],
      occupation: [
        {
          value: "GE",
          filtername: "(GE) Government Employee",
          filterstatus: false,
        },
        {
          value: "PE",
          filtername: "(PE) Private Employee",
          filterstatus: false,
        },
        {
          value: "OFW",
          filtername: "(OFW) Overseas Filipino Worker",
          filterstatus: false,
        },
        { value: "OTHER", filtername: "OTHER", filterstatus: false },
      ],
      education: [
        { value: "elem", filtername: "ELEMENTARY", filterstatus: false },
        { value: "hs", filtername: "HIGHSCHOOL", filterstatus: false },
        { value: "college", filtername: "COLLEGE", filterstatus: false },
        { value: "other", filtername: "OTHER OSC/OSY", filterstatus: false },
      ],
      religion: [
        { value: "RC", filtername: "(RC) Roman Catholic", filterstatus: false },
        {
          value: "INC",
          filtername: "(INC) Iglesia Ni Cristo",
          filterstatus: false,
        },
        { value: "BC", filtername: "(BC) Before Christ", filterstatus: false },
        { value: "OTHER", filtername: "OTHER", filterstatus: false },
      ],
      sector: [
        { value: "src", filtername: "Sr.C", filterstatus: false },
        { value: "sp", filtername: "SP", filterstatus: false },
        { value: "fourps", filtername: "4PS", filterstatus: false },
      ],
      lactating: [
        { value: "true", filtername: "Lactating", filterstatus: false },
      ],
      pwd: [{ value: "true", filtername: "PWD", filterstatus: false }],
      familyclass: [
        { value: "low", filtername: "Low Class", filterstatus: false },
        { value: "mid", filtername: "Mid Class", filterstatus: false },
        { value: "high", filtername: "High Class", filterstatus: false },
      ],
    };

    // Parse search parameters and update filterstatus accordingly
    const params = new URLSearchParams(window.location.search);

    for (const [group, items] of Object.entries(initialFilters)) {
      if (params.has(group)) {
        const values = params.get(group)!.split(",");
        items.forEach((item: any) => {
          if (values.includes(item.value)) {
            item.filterstatus = true;
          }
        });
      }
    }

    return initialFilters;
  };

  const [filters, setFilters] = useState(getInitialFilters());

  const updateUrlWithFilters = () => {
    const params: Record<string, string[]> = {};

    for (const [group, items] of Object.entries(filters)) {
      const selectedFilters = items
        .filter((item) => item.filterstatus)
        .map((item) => item.value);
      if (selectedFilters.length > 0) {
        params[group] = selectedFilters;
      }
    }

    const queryString = new URLSearchParams(
      params as unknown as Record<string, string>
    ).toString();
    router.push(`?${queryString}`);
  };

  const handleFilterChange = (group: keyof typeof filters, index: number) => {
    const updatedFilters = { ...filters };
    updatedFilters[group][index].filterstatus =
      !updatedFilters[group][index].filterstatus;
    setFilters(updatedFilters);

    // Clear specific age input when an age filter is selected
    if (group === "age") {
      setSpcage("");

      // Remove "spcage" from the URL
      const params = new URLSearchParams(window.location.search);
      params.delete("spcage");
      router.push(`?${params.toString()}`);
    }

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
      <label className="underline underline-offset-2">{label}</label>
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
        className="w-full py-1 border-[1px] border-zinc-800 hover:border-red-50 hover:text-red-500"
      >
        CLEAR FILTER
      </button>
      {renderFilterGroup("GENDER", "gender")}
      {renderFilterGroup("AGE", "age")}
      <input
        type="number"
        className="p-2 w-full"
        placeholder="Input Specific Age"
        value={spcage}
        onChange={(e) => {
          const value = e.target.value;
          setSpcage(value);

          // Update URL with spcage
          const params = new URLSearchParams(window.location.search);

          if (value) {
            params.set("spcage", value);
          } else {
            params.delete("spcage");
          }

          router.push(`?${params.toString()}`);
        }}
      />
      {renderFilterGroup("CIVIL STATUS", "civilStatus")}
      {renderFilterGroup("OCCUPATION", "occupation")}
      {renderFilterGroup("EDUCATION", "education")}
      {renderFilterGroup("RELIGION", "religion")}
      {renderFilterGroup("SECTOR", "sector")}
      {renderFilterGroup("LACTATING", "lactating")}
      {renderFilterGroup("PWD", "pwd")}
      {renderFilterGroup("FAMILY CLASS", "familyclass")}
    </div>
  );
};

export default FilterList;
