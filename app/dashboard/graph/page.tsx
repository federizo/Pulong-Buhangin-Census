"use client";

import CensusFilteredGraph from "@/components/ui_census/census_filtered_graph";
import CensusGraphMaleFemale from "@/components/ui_census/census_graph_male_female";
import CensusGraphPopulation from "@/components/ui_census/census_graph_population";
import React from "react";

export default function Graph() {
  return (
    <div className="space-y-5 min-w-full max-w-7xl h-full  flex flex-col">
      <h1 className="text-3xl font-bold">Census Graph</h1>
      <div className="flex flex-col gap-5 py-5 px-2 overflow-y-auto h-full">
        <div className="w-full h-fit  flex gap-5">
          <CensusFilteredGraph />
        </div>
        <div className="h-[600px] flex flex-col gap-2">
          <CensusGraphMaleFemale year={2024} show={true} />
        </div>
        <div>
          <CensusGraphPopulation show={true} />
        </div>
      </div>
    </div>
  );
}
