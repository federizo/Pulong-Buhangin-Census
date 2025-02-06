/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, LabelList, Pie, PieChart, Sector } from "recharts";
import { getHouseProfileLocation } from "@/lib/api/apitGET";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const pouplationCofig = {
  visitors: {
    label: "Overall Population",
  },
  km37: {
    label: "KM 37",
    color: "hsl(var(--chart-1))",
  },
  km38: {
    label: "KM 38",
    color: "hsl(var(--chart-2))",
  },
  km39: {
    label: "KM 39",
    color: "hsl(var(--chart-3))",
  },
  km40: {
    label: "KM 40",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const CensusGraphPopulation = ({ show }: { show: boolean }) => {
  const [chartData, setChartData] = useState<any>([
    { kilometer: "37", population: 0, fill: "#4285F4" }, // Blue
    { kilometer: "38-A", population: 0, fill: "#FFAC45" }, // Orange
    { kilometer: "38-B", population: 0, fill: "#e6ff33" }, // Orange
    { kilometer: "38-POBLACION", population: 0, fill: "#C70039" }, // Orange
    { kilometer: "39", population: 0, fill: "#FF7139" }, // Red
    { kilometer: "40", population: 0, fill: "#0008D7" }, // Dark Blue
    { kilometer: "41", population: 0, male: 0, female: 0, fill: "#33dc88" },
    { kilometer: "42", population: 0, male: 0, female: 0, fill: "#33dcb8" },
  ]);
  const [dataDB, setDataDB] = useState<any>([]);

  useLayoutEffect(() => {
    const handleFetchMembers = async () => {
      const response = await getHouseProfileLocation();
      setDataDB(response);
    };
    handleFetchMembers();
  }, []);

  useEffect(() => {
    sortData();
  }, [dataDB]);

  const sortData = () => {
    const updatedChartData = chartData.map((item: any) => {
      let count = 0;

      dataDB.forEach((entry: any) => {
        entry.Location.forEach((location: any) => {
          if (location.Kilometer === item.kilometer) {
            count += parseInt(entry.NumberofMembers || "0", 10);
          }
        });
      });

      return {
        ...item,
        population: count,
      };
    });

    // Handle other locations not matching KM 37-40
    const otherCount = dataDB.reduce((total: number, entry: any) => {
      const isOther = entry.Location.every(
        (location: any) =>
          ![
            "37",
            "38-A",
            "38-B",
            "38-POBLACION",
            "39",
            "40",
            "41",
            "42",
          ].includes(location.Kilometer)
      );
      if (isOther) {
        return total + parseInt(entry.NumberofMembers || "0", 10);
      }
      return total;
    }, 0);

    setChartData((prevData: any) =>
      updatedChartData.map((data: any) =>
        data.kilometer === "other" ? { ...data, population: otherCount } : data
      )
    );
  };

  const topThree = [...chartData]
    .sort((a, b) => b.population - a.population) // Sort by population descending
    .slice(0, 3); // Take the first 3 entries

  return (
    <div className="w-full h-full dark:bg-graident-dark rounded-md shadow-md py-2 border-[1px]">
      <div className="w-full text-center p-2 ">
        Overall Population For Each KM
      </div>

      <ChartContainer
        config={pouplationCofig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart width={300} height={300} >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData.filter((item: any) => item.population > 0)} // Filter out items with 0 population
            dataKey="population"
            nameKey="kilometer"
            innerRadius={70}
            strokeWidth={2}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <Sector {...props} outerRadius={outerRadius + 10} />
            )}
            label={({ payload, ...props }) => {
              const { cx, cy, x, y, textAnchor, dominantBaseline } = props;
              return (
                <text
                  cx={cx}
                  cy={cy}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  fill="hsla(var(--foreground))"
                >
                  {payload.population}
                </text>
              );
            }}
          >
            <Label
              content={(props: any) => {
                const { viewBox } = props; // Use LabelProps type
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {chartData
                          .filter((item: any) => item.population > 0) // Include only non-zero population items
                          .reduce(
                            (total: number, item: any) =>
                              total + item.population,
                            0
                          )}
                      </tspan>
                      <tspan
                        x={cx}
                        y={(cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Overall Population
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="px-10 flex justify-evenly">
        {chartData.map((item: any, index: any) => (
          <div className="flex flex-col items-center" key={index}>
            <label className="uppercase text-slate-700 dark:text-slate-500 ">
              {item.kilometer !== "other" && "KM "}
              {item.kilometer.slice(0, 6)}
            </label>
            <label className="uppercase ">{item.population}</label>
            <div
              key={index}
              className="h-5 w-5 rounded-md"
              style={{ backgroundColor: item.fill }}
            ></div>
          </div>
        ))}
      </div>
      {show && (
        <p className="text-2xl px-10 tracking-wide text-black dark:text-slate-300 text-justify mt-5">
          The top 3 most population in a Kilometer is{" "}
          <span style={{ color: topThree[0].fill }}>
            KM {topThree[0].kilometer}
          </span>{" "}
          with the total of population of{" "}
          <span style={{ color: topThree[0].fill }}>
            {topThree[0].population}
          </span>
          , next is the{" "}
          <span style={{ color: topThree[1].fill }}>
            KM {topThree[1].kilometer}
          </span>{" "}
          with total population of{" "}
          <span style={{ color: topThree[1].fill }}>
            {topThree[1].population},
          </span>{" "}
          Then last is{" "}
          <span style={{ color: topThree[2].fill }}>
            KM {topThree[2].kilometer}
          </span>{" "}
          with total population of{" "}
          <span style={{ color: topThree[2].fill }}>
            {topThree[2].population}.
          </span>
        </p>
      )}
    </div>
  );
};

export default CensusGraphPopulation;
