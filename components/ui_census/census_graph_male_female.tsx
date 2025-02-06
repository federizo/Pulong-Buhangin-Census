/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getFamMember } from "@/lib/api/apitGET";

const chartConfig = {
  female: {
    label: "Female",
    color: "#ffc0cb",
  },
  male: {
    label: "Male",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const CensusGraphMaleFemale = ({
  year,
  show,
}: {
  year: number;
  show: boolean;
}) => {
  const [chartData, setChartData] = useState<any>([
    { kilometer: "37", kilometerlabel: "KM 37", female: 0, male: 0 },
    { kilometer: "38-A", kilometerlabel: "KM 38-A", female: 0, male: 0 },
    { kilometer: "38-B", kilometerlabel: "KM 38-B", female: 0, male: 0 },
    {
      kilometer: "38-POBLACION",
      kilometerlabel: "KM 38-POBLACION",
      female: 0,
      male: 0,
    },
    { kilometer: "39", kilometerlabel: "KM 39", female: 0, male: 0 },
    { kilometer: "40", kilometerlabel: "KM 40", female: 0, male: 0 },
    { kilometer: "41", kilometerlabel: "KM 41", female: 0, male: 0 },
    { kilometer: "42", kilometerlabel: "KM 42", female: 0, male: 0 },
  ]);

  const totalFemale = chartData.reduce(
    (total: any, entry: any) => total + entry.female,
    0
  );
  const totalMale = chartData.reduce(
    (total: any, entry: any) => total + entry.male,
    0
  );

  const [dataDB, setDataDB] = useState<any>([]);

  useLayoutEffect(() => {
    const handleFetchMembers = async () => {
      const response = await getFamMember();
      setDataDB(response);
    };

    handleFetchMembers();
  }, []);

  useEffect(() => {
    const processData = () => {
      const maleFemaleCount: Record<string, { male: number; female: number }> =
        {};

      // Flatten and sort the data by created_at date
      const sortedData = dataDB
        .flatMap(
          ({ FamMembers, Locations }: { FamMembers: any; Locations: any }) =>
            Locations.map((location: any) => ({
              location,
              members: FamMembers,
            }))
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.location.created_at).getTime() -
            new Date(b.location.created_at).getTime()
        );

      sortedData.forEach(
        ({ members, location }: { members: any; location: any }) => {
          const kilometer = location.Kilometer || "OTHER";
          if (!maleFemaleCount[kilometer]) {
            maleFemaleCount[kilometer] = { male: 0, female: 0 };
          }

          members.forEach((member: any) => {
            if (member.Gender === "male") {
              maleFemaleCount[kilometer].male += 1;
            } else if (member.Gender === "female") {
              maleFemaleCount[kilometer].female += 1;
            }
          });
        }
      );

      const newChartData = chartData.map((data: any) => ({
        ...data,
        male: maleFemaleCount[data.kilometer]?.male || 0,
        female: maleFemaleCount[data.kilometer]?.female || 0,
      }));

      setChartData(newChartData);
    };

    processData();
  }, [dataDB]);

  return (
    <div className="w-full h-full dark:bg-gradient-dark rounded-md shadow-md py-2 pb-12 border-[1px] flex flex-col">
      {/* <pre>  {JSON.stringify(chartData, null, 2)}</pre> */}
      <div className="w-full text-center p-2 tracking-wide">
        Female and Male recorded for each KM ({year})
      </div>
      <ChartContainer config={chartConfig} className="h-[90%] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="kilometerlabel"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 8)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="male" fill="var(--color-male)" radius={4}>
            <LabelList
              dataKey="male"
              position="inside"
              offset={8}
              className="fill-black"
              fontSize={12}
            />
          </Bar>
          <Bar dataKey="female" fill="var(--color-female)" radius={4}>
            <LabelList
              dataKey="female"
              position="inside"
              offset={8}
              className="fill-black"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      {show && (
        <p className="text-2xl px-10 tracking-wide text-black dark:text-slate-300 text-justify">
          Female and Male count for each Kilometer in{" "}
          <span className="underline underline-offset-4 text-black dark:text-slate-100">
            Pulong Buhangin
          </span>
          . The total Male recorded is{" "}
          <span className="underline underline-offset-4 text-blue-700">
            {totalMale}
          </span>{" "}
          and the total for Female is{" "}
          <span className="underline underline-offset-4 text-[#ffc0cb]">
            {totalFemale}
          </span>
          . Overall total of{" "}
          <span className="underline underline-offset-4 text-green-500">
            {totalFemale + totalMale}
          </span>{" "}
          .
        </p>
      )}
    </div>
  );
};

export default CensusGraphMaleFemale;
