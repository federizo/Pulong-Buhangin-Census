/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const generatePDF = async (ref: any, item: any) => {
  if (!ref) return;
  try {
    const canvas = await html2canvas(ref, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("l", "mm", "legal");

    const pdfWidth = 355.6;
    const pdfHeight = 200;

    // Calculate scaling ratios
    const scale = pdfWidth / canvas.width;
    const scaledHeight = canvas.height * scale;

    // Calculate total pages needed
    const numberOfPages = Math.ceil(scaledHeight / pdfHeight);

    for (let i = 0; i < numberOfPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate the position to clip the image
      const sourceY = (i * pdfHeight / scale);

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
      );
    }

    const fileName = `HOUSEPROFILE_${moment().format("LL")}_${item.HouseProfileId}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF", error);
  }
};




const PDF_LAYOUT_FAM = ({ item }: { item: any }) => {
  const divRef = React.useRef(null);

  return (
    <div className=" overflow-auto ">
      <button
        onClick={() => generatePDF(divRef.current, item)}
        className="border-[1px] duration-300 bg-red-400 hover:bg-red-500 px-5 py-1 rounded-md flex gap-1 items-center"
      >
        <FaRegFilePdf />
        PDF
      </button>


      {/* FORM */}

      <div
        ref={divRef}
        id={"content-to-pdf"}
        style={{ position: "absolute", top: "-999999999px" }}
        className="p-5 w-[1640.16px] h-auto mt-5 bg-white text-black flex flex-col text-12 uppercase items-center justify-center"
      >
        {/* FIRST LAYER */}
        <div className="border-[1px] w-full flex justify-center items-center h-14 font-bold">
          <img
            src={
              "https://scontent.xx.fbcdn.net/v/t1.15752-9/462636565_479361017790178_497837260792210135_n.png?_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeGJrJIYdLsLDiRVt5g1S87e3W2zO3EwrSfdbbM7cTCtJ3XD1o19EDGHn4NMptf8blCsk_d43CUd1eX1W_4VfKOF&_nc_ohc=0ppUH-B679wQ7kNvgEnVdd2&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1QEpw2F_QnhaVdLDJ4SZC9c5HHwMEUqx_Wqp8FgVFgr1Sg&oe=676903E3"
            }
            alt="logo"
            className="h-full"
          />
          <div className="tracking-widest items-center justify-center text-2xl h-full">
            PULONG BUHANGIN CENSUS POPULATION
          </div>
        </div>

        {/* SHOW MEMBER HERE */}
        <div className="flex flex-col gap-1 w-full">
          <div className="grid grid-cols-12 w-full border-[1px] font-medium  text-center h-[40px]">
            <div className=" text-center">
              <label className=" "> F/M/L/Sfx</label>
            </div>
            <div className=" text-center ">
              <label className=" ">RELATIONSHIP</label>
            </div>
            <div className=" text-center">
              <label className="">BIRTHDAY</label>
            </div>
            <div className=" text-center">
              <label className="">AGE</label>
            </div>
            <div className=" text-center">
              <label className="">GENDER</label>
            </div>
            <div className=" text-center">
              <label className="">CIVIL STATUS</label>
            </div>
            <div className=" text-center">
              <label className="">OCCUPATION</label>
            </div>
            <div className=" text-center">
              <label className="">EDUCATION</label>
            </div>
            <div className=" text-center">
              <label className="">RELIGION</label>
            </div>
            <div className=" text-center">
              <label className="">SECTOR</label>
            </div>
            <div className=" text-center">
              <label className="">PWD</label>
            </div>
            <div className=" text-center">
              <label className="">LACTATING</label>
            </div>
          </div>

          {item?.map(
            (member: any) => (
              <div
                key={member.id}
                className="grid grid-cols-12 w-full px-1 py-3 mt-2 border-[0.5px] items-center "
              >
                <div className=" text-center w-full ">
                  <label className="text-medium text-center">
                    {member.FirstName} {member.MiddleName} {member.LastName}{" "}
                    {member.Suffix}
                  </label>
                </div>
                <div className=" text-center w-full ">
                  <label className=" ">{member.FamilyRelationship}</label>
                </div>
                <div className=" text-center">
                  <label className="">{member.Birthday}</label>
                </div>
                <div className="r text-center">
                  <label className="">{member.Age}</label>
                </div>
                <div className=" text-center">
                  <label className="">{member.Gender}</label>
                </div>
                <div className=" text-center">
                  <label className="">{member.CivilStatus}</label>
                </div>
                <div className=" text-center">
                  <label className="">
                    {member.Occupation.value === ""
                      ? "N/A"
                      : member.Occupation.value}
                  </label>
                </div>
                <div className=" text-center">
                  {Array.isArray(member.Education) ? (
                    member.Education.map((edu: any) => (
                      <span key={edu.elem}>
                        elem: {edu.elem} HS: {edu.hs} COLLEGE: {edu.college}{" "}
                        OTHERS: {edu.other}
                      </span>
                    ))
                  ) : (
                    <span>No data </span>
                  )}
                </div>
                <div className="text-center">
                  <label className="">{member.Religion.value}</label>
                </div>
                <div className=" text-center">
                  <label className=" text-center">
                    {Array.isArray(member.Sector) ? (
                      member.Sector.map((sec: any) => (
                        <span key={sec.sp}>
                          SP: {sec.sp} SRC: {sec.src} 4ps: {sec.fourps}
                        </span>
                      ))
                    ) : (
                      <span>No data </span>
                    )}
                  </label>
                </div>

                <div className=" text-center">
                  <label className="">
                    <span>{member.Disability}</span>
                  </label>
                </div>
                <div className="text-center">
                  <label className="">
                    <span>{member.Lactating ? "Yes" : "No"}</span>
                  </label>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PDF_LAYOUT_FAM;

const Line = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%] mb-4 mt-4 h-[1px] bg-zinc-800 bg-opacity-50" />
    </div>
  );
};
