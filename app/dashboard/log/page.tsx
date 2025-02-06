"use client";

import { getLog } from "@/lib/api/apitGET";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { useTheme } from "next-themes";

const Log = () => {
  const [logData, setLogData] = useState<any>([]);
  const [selected, setSelected] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { theme, setTheme } = useTheme();

  const HandleGetLogData = async () => {
    const response = await getLog(); // Call getLog to fetch data
    if (response) {
      setLogData(response); // Update state with the fetched data
    } else {
      console.error("Failed to fetch log data");
    }
  };

  useEffect(() => {
    HandleGetLogData();
  }, []);

  const filteredLogData = logData.filter(
    (item: any) =>
      item.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex">
      <div className="border-[1px] border-zinc-800 rounded-md w-full h-full p-2 flex flex-col gap-2">
        <h1 className="text-[3vh] font-semibold tracking-wider">USERS LOG</h1>
        <div className="flex items-center gap-2 border-[1px] border-zinc-800 px-2 py-1 rounded-sm">
          <CiSearch className="text-[3vh] text-zinc-700" />
          <div className="w-[1px] h-[30px] bg-zinc-800" />
          <input
            type="search"
            className="p-1 w-full bg-transparent outline-none"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden lg:grid grid-cols-5 border-[1px] border-zinc-800 px-3 py-2 rounded-sm mt-2 font-medium">
          <label>ACTION DATE</label>
          <label>AGENT ID</label>
          <label>AGENT NAME</label>
          <label className="overflow-hidden truncate">AGENT ACTION</label>
          <label></label>
        </div>
        <div className="flex flex-col h-full overflow-y-auto">
          {filteredLogData
            .sort((a: any, b: any) => (a.create_at > b.create_at ? 1 : -1))
            .map((item: any, index: number) => (
              <div key={index}>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 border-[1px] border-zinc-800 px-3 py-2 rounded-sm mt-2 items-center">
                  <label className="overflow-hidden truncate">
                    {moment(item.created_at).format("LLL")}
                  </label>
                  <label className="overflow-hidden truncate">
                    {item.agent_id}
                  </label>
                  <label className="overflow-hidden truncate">
                    {item.agent_name}
                  </label>
                  <label className="overflow-hidden truncate">
                    {item.action}
                  </label>
                  <button
                    onClick={() => setSelected(item)}
                    className="border-[1px] border-zinc-800 w-full lg:w-fit px-10 py-1 lg:col-span-1 col-span-2 bg-green-600 rounded-md hover:border-green-500 hover:text-green-500 duration-300"
                  >
                    VIEW
                  </button>
                </div>
                {selected.length !== 0 && (
                  <div className="fixed inset-0 w-screen h-screen flex justify-center items-center backdrop-blur-[1px]">
                    <div
                      className={`w-[350px] h-[150px] border-[1px] border-zinc-600 rounded-md flex-col flex px-2 py-1 gap-1 ${
                        theme === "light" ? "bg-white" : "bg-zinc-900"
                      }`}
                    >
                      <div className="w-full flex justify-end ">
                        <AiOutlineClose
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => setSelected([])}
                        />
                      </div>
                      <label className="font-bold">
                        Action:{" "}
                        <span className="tracking-wider">
                          {selected.action}
                        </span>
                      </label>
                      <label className="font-bold">
                        Description:{" "}
                        <span className=" tracking-wider">
                          {" "}
                          {selected.description}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Log;
