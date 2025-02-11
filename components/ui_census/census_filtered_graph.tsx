"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAllMembers, getHouseProfileLocation } from "@/lib/api/apitGET";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import FilterList from "@/app/dashboard/familyprofile/ui/filter_list";
import { useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const CensusFilteredGraph = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [membersData, setMembersData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0); // ✅ Add this line

  const [chartData, setChartData] = useState<any>([
    { kilometer: "37", population: 0, male: 0, female: 0, fill: "#4285F4" },
    { kilometer: "38-A", population: 0, male: 0, female: 0, fill: "#FFAC45" },
    { kilometer: "38-B", population: 0, male: 0, female: 0, fill: "#e6ff33" },
    {
      kilometer: "38-POBLACION",
      population: 0,
      male: 0,
      female: 0,
      fill: "#C70039",
    },
    { kilometer: "39", population: 0, male: 0, female: 0, fill: "#FF7139" },
    { kilometer: "40", population: 0, male: 0, female: 0, fill: "#0008D7" },
    { kilometer: "41", population: 0, male: 0, female: 0, fill: "#33dc88" },
    { kilometer: "42", population: 0, male: 0, female: 0, fill: "#33dcb8" },
  ]);

  const searchParams = useSearchParams();

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

  const handleFetchHouseProfile = async () => {
    try {
      setMembersData([]); // Clear previous data
      const response: any = await getAllMembers();
      setMembersData(response.response || []);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = membersData?.filter((profile) => {
    // Filter logic for gender, age, civil status, occupation, education, etc.
    const matchesGender = genderParams.length
      ? genderParams.includes(profile.Gender.toUpperCase())
      : true;
    const age = parseInt(profile.Age);
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
    const matchesCivilStatus = civilStatusParams.length
      ? civilStatusParams.includes(profile.CivilStatus.toUpperCase())
      : true;
    const matchesOccupation = occupationParams.length
      ? occupationParams.includes(profile.Occupation.value.toUpperCase()) ||
        occupationParams.includes(profile.Occupation.other.toUpperCase())
      : true;
    const matchesEducation =
      educationParams.length && profile.Education
        ? educationParams.some(
            (educ) => profile.Education[educ.toLowerCase()] === true
          )
        : true;
    const matchesReligion = religionParams.length
      ? religionParams.includes(profile.Religion.value.toUpperCase()) ||
        religionParams.includes(profile.Religion.other.toUpperCase())
      : true;
    const matchesSector = sectorParams.length
      ? sectorParams.some(
          (sector) => profile.Sector[sector.toLowerCase()] === true
        )
      : true;
    const matchesLactating = lactatingParams.includes("true")
      ? profile.Lactating === "true"
      : true;
    const matchesFamilyClass = familyclassParams.length
      ? familyclassParams.includes((profile.familyclass || "").toLowerCase())
      : true;
    const matchesPWD = pwdParams.includes("true")
      ? profile.Disability !== ""
      : true;

    return (
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

  useLayoutEffect(() => {
    handleFetchHouseProfile();
  }, []);

  useEffect(() => {
    const updatedChartData = chartData.map((chartItem: any) => {
      const filtered = filteredData.filter(
        (item: any) => item.kilometer === chartItem.kilometer
      );

      // Count males and females
      const maleCount = filtered.filter(
        (item: any) => item.Gender === "male"
      ).length;
      const femaleCount = filtered.filter(
        (item: any) => item.Gender === "female"
      ).length;

      return {
        ...chartItem,
        population: maleCount + femaleCount,
        male: maleCount,
        female: femaleCount,
      };
    });

    // Update chart data only if there is a meaningful change
    if (JSON.stringify(updatedChartData) !== JSON.stringify(chartData)) {
      setChartData(updatedChartData);
    }
  }, [filteredData, chartData]);

  const allParams = Object.fromEntries(searchParams.entries());

  return (
    <div className="w-full h-fit flex flex-col gap-2 p-2 border-[1px] border-zinc-800 rounded-md ">
      <div className="flex w-full gap-4 items-center flex-wrap">
        <button
          onClick={() => setModal(true)}
          className={` border-[1px] border-zinc-800 w-fit px-6 py-1 rounded-sm duration-300 hover:bg-blue-700 bg-blue-400`}
        >
          FILTER
        </button>
        <label className="uppercase tracking-wider text-lg font-medium">
          Filter specific category of data by members
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(allParams).map(([key, value], index) => (
          <div
            key={index}
            className="w-auto h-fit uppercase border-[1px] px-4 py-1 rounded"
          >
            <span>
              {key}: {value}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full flex relative z-0 gap-4 flex-wrap">
        <FilterList
          open={modal}
          setOpen={setModal}
          setCurrentPage={setCurrentPage}
        />
        <PieComponent chartData={chartData} />
        <BarComponent chartData={chartData} />
      </div>
    </div>
  );
};

export default CensusFilteredGraph;

export function PieComponent({ chartData }: { chartData: any }) {
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

  return (
    <div className="flex flex-col dark:bg-graident-dark rounded-sm border-[1px] border-zinc-800 w-full z-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart Kilometer</CardTitle>
        <CardDescription>
          Male and Female Count for each Kilometer
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pouplationCofig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart width={300} height={300}>
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
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="grid-cols-8 grid">
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
      </CardFooter>
    </div>
  );
}

export function BarComponent({ chartData }: { chartData: any }) {
  const genderConfig = {
    female: {
      label: "Female",
      color: "#ffc0cb", // Pink
    },
    male: {
      label: "Male",
      color: "#60a5fa", // Blue
    },
  };

  const chartDataWithoutFill = chartData.map(({ fill, ...rest }: any) => rest);
  return (
    <div className="w-full lg:w-[40%] flex-1 flex flex-col dark:bg-graident-dark rounded-sm border-[1px] border-zinc-800 z-0">
      <CardHeader>
        <CardTitle>Bar Chart for Male and Female Count</CardTitle>
        <CardDescription>
          Per Male and Female count for each Kilometer{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={genderConfig}>
          <BarChart
            data={chartDataWithoutFill
              .filter((item: any) => item.male > 0 || item.female > 0)
              .map((item: any) => {
                const newItem: any = { ...item };
                if (newItem.male <= 0) delete newItem.male;
                if (newItem.female <= 0) delete newItem.female;
                return newItem;
              })}
            className=""
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="kilometer"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="male"
              stackId="a"
              layout="vertical"
              fill={genderConfig.male.color} // Manual color for male
              radius={[0, 0, 4, 4]}
            >
              <LabelList
                dataKey="male"
                position="inside"
                offset={8}
                className="fill-black"
                fontSize={12}
              />
            </Bar>

            <Bar
              dataKey="female"
              stackId="a"
              fill={genderConfig.female.color} // Manual color for female
              radius={[4, 4, 0, 0]}
            >
              {}
              <LabelList
                dataKey="female"
                position="middle"
                offset={8}
                className="fill-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
