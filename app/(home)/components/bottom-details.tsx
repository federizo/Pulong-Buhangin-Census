"use client";
import { useTheme } from "next-themes";
import React from "react";
import { Card } from "@/components/ui/card";
const BottomDetails = () => {
  const { theme, setTheme } = useTheme();

  const barangays = [
    {
      title: "Mag-Asawang Sapa, Santa Maria",
      Src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQedgNfwn936zec9D0mC1r_4CyWzWMV7PHDA&s",
      map: "https://maps.app.goo.gl/j8BZPYCREUPg51Xt9",
    },
    {
      title: "Tigbe, Norzagaray, Bulacan",
      Src: "https://jepepips.wordpress.com/wp-content/uploads/2014/09/img_9213.jpg",
      map: "https://maps.app.goo.gl/quPLWo7wcgX6EMD16",
    },
    {
      title: "Silangan, Santa Maria, Bulacan",
      Src: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Jf3448Silangan_Hall_Santa_Maria_Bulacanfvf_27.JPG",
      map: "https://maps.app.goo.gl/VSRu6Xj8Cf1bKfzb6",
    },
    {
      title: "Balasing, Santa Maria, Bulaca",
      Src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Pandi_Church.jpg/760px-Mapcarta.jpg",
      map: "https://maps.app.goo.gl/TzFx2842LW4k6QvS8",
    },
    {
      title: "Caypombo, Santa Maria, Bulacan",
      Src: " https://photos.wikimapia.org/p/00/00/82/62/94_big.jpg",
      map: "https://maps.app.goo.gl/K898Ev8Ke8XcN6GS8",
    },
  ];

  return (
    <div className="w-full h-full xl:flex flex-col xl:py-[5rem]">
      <div className="flex items-center w-full justify-center mt-10">
        <div className="w-[70%] h-[1px] bg-slate-800" />
      </div>
      <div className="py-10">
        <div className="flex flex-col w-100 text-[2rem] font-semibold items-center">
          <h1>Adjacent Barangays</h1>
        </div>

        <div className="mt-5  flex-wrap flex lg:flex-nowrap lg:flex w-full items-center justify-center gap-10">
          {barangays.map((item, index) => (
            <div
              onClick={() => window.open(item.map, "")}
              key={index}
              style={{
                backgroundImage: `url(${item.Src})`,
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                backgroundColor: "hsl(var(--background))",
              }}
              className="group bg-cover hover:bg-left bg-center bg-no-repeat h-[200px] w-[200px] bg-slate-600 flex justify-center items-end hover:scale-110 duration-300 cursor-pointer rounded-md"
            >
              <div className="p-2 font-semibold backdrop-blur-[1px] bg-black bg-opacity-40 group-hover:text-md text-white">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BottomDetails;
