/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const generatePDF = async (ref: any, item: any) => {
  if (!ref) return; // Ensure the reference exists
  try {
    // Capture the div as a canvas
    const canvas = await html2canvas(ref, {
      scale: 2, // Increase the scale for higher resolution
      useCORS: true, // Ensure cross-origin images are handled
    });
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay

    // Convert the canvas to an image (PNG format)
    const imgData = canvas.toDataURL("image/png", 1.0);

    // Create a PDF document in landscape orientation, millimeter units, and legal size
    const pdf = new jsPDF("l", "mm", "legal");

    // Legal page dimensions in millimeters
    const pdfWidth = 355.6; // 14 inches in mm
    const pdfHeight = 200; // 8.5 inches in mm

    // Scale the image to fit within the legal page size while maintaining aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const scaledWidth = imgWidth * scaleFactor;
    const scaledHeight = imgHeight * scaleFactor;

    // Center the image on the page
    const xOffset = (pdfWidth - scaledWidth) / 2;
    const yOffset = (pdfHeight - scaledHeight) / 2;

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

    // Generate the file name with the house number and current date
    const fileName = `HOUSEPROFILE_${moment().format("LL")}_${
      item.HouseProfileId
    }.pdf`;

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF", error); // Log any errors
  }
};

// const PDF_LAYOUT = ({ item }: { item: any }) => {
//   const divRef = React.useRef(null);

const PDF_LAYOUT = ({ item }: { item: any }) => {
  const divRef = useRef(null);
  const [apartmentData, setApartmentData] = useState(item.Apartment || {});

  useEffect(() => {
    console.log("🚀 PDF_LAYOUT received item:", item);
    console.log("🏠 Apartment Data in State:", item.Apartment);
    setApartmentData(item.Apartment || {});
  }, [item]);

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
        style={{ position: "absolute", top: "-9999px" }}
        className="p-5 w-[1640.16px] h-[1016.93px] mt-5 bg-white text-black flex flex-col text-12 uppercase items-center justify-center"
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
            PULONG BUHANGIN CENSUS FAMILY PROFILE
          </div>
        </div>

        {/* Location[0] LAYER */}
        <div className="grid grid-cols-1 w-full text-start px-1 border-[1px]  border-t-[0px]  h-auto py-4">
          <div className="grid grid-cols-4">
            <div className="_container">
              <label className="">DATE CREATED:</label>
              <label>{moment(item.create_at).format("LLL")}</label>
            </div>

            <div className="_container">
              <label className="">NO. OF FAMILY MEMBERS:</label>
              <label>{item.NumberofMembers}</label>
            </div>

            <div className="_container">
              <label className="">NO. OF FAMILY:</label>
              <label>{item.NumberOfFamily}</label>
            </div>

            <div className="_container"></div>
          </div>

          <div className="grid grid-cols-4">
            <div className="_container">
              <label className="">HOUSE NO.:</label>
              <label>{item.HouseNumber}</label>
            </div>

            <div className="_container">
              <label className="">BC NO:</label>
              <label></label>
            </div>

            <div className="_container">
              <label className="">KM:</label>
              <label>{item.Location[0].Kilometer}</label>
            </div>

            <div className="_container">
              <label className="">STREET:</label>
              <label>{item.Location[0].Street}</label>
            </div>
          </div>

          <div className="grid grid-cols-4">
            <div className="_container">
              <label className="">SUBD:</label>
              <label>{item.Location[0].SubdivisionName}</label>
            </div>

            <div className="_container">
              <label className="">BLOCK:</label>
              <label>{item.Location[0].Block}</label>
            </div>

            <div className="_container">
              <label className="">LOT:</label>
              <label>{item.Location[0].Lot}</label>
            </div>

            <div className="_container">
              <label className="">PHASE:</label>
              <label>{item.Location[0].Phase}</label>
            </div>
          </div>
        </div>

        <Line />

        {/* SHOW MEMBER HERE */}
        <div className="flex flex-col gap-1 w-full">
          <div className="mt-1 mb-1 font-semibold">FAMILY MEMBERS</div>
          {/* HEADER LAYER */}
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

          {item?.FamMember?.filter((res: any) => res.Age >= 5).map(
            (member: any) => (
              <div
                key={member.id}
                className="grid grid-cols-12 w-full px-1 py-3 border-[0.5px] items-center "
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
                <div className="text-center">
  {member.Education ? (
    <span>
      {typeof member.Education === "object" ? ( // If Education is an object
        <>
          elem: {member.Education.elem} HS: {member.Education.hs} COLLEGE: {member.Education.college} OTHERS: {member.Education.other}
        </>
      ) : (
        <>{member.Education}</> // If Education is just a string
      )}
    </span>
  ) : (
    <span>No data</span>
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
                    <span>{member.Lactating === "yes" ? "Yes" : "No"}</span>
                  </label>
                </div>
              </div>
            )
          )}
        </div>

        {/* SHOW MEMBER BELOW 5 HERE */}

        <div className="mt-1 mb-2 font-semibold">
          0-59 MONTHS OLD {"(BELOW 5 Y/O)"}{" "}
          <span className="font-medium">
            {item.FamMember.filter((res: any) => res.Age <= 5).length === 0 &&
              ": NONE"}
          </span>
        </div>

        {item?.FamMember?.filter((res: any) => res.Age <= 5).length !== 0 && (
          <div className="w-full grid gap-1">
            <div className="grid grid-cols-7 w-full border-[1px] font-medium  text-center h-[40px]">
              <div className="_below_5">
                <label className=" ">F/M/L/Sfx</label>
              </div>
              <div className="_below_5">
                <label className="">BIRTHDAY</label>
              </div>
              <div className="_below_5">
                <label className="">AGE</label>
              </div>
              <div className="_below_5">
                <label className="">GENDER</label>
              </div>
              <div className="grid grid-cols-4">
                <div className="_below_5">
                  <label className="">BCG</label>
                </div>
                <div className="_below_5">
                  <label className="">DPT</label>
                </div>
                <div className="_below_5">
                  <label className="">POLIO</label>
                </div>
                <div className="_below_5">
                  <label className="">MEASLES</label>
                </div>
              </div>
              <div className="_below_5">
                <label className="">WEIGHT</label>
              </div>
              <div className="_below_5">
                <label className="">HEIGHT</label>
              </div>
            </div>
            {item?.FamMember?.filter((res: any) => res.Age <= 5).map(
              (member: any) => (
                <div
                  key={member}
                  className="grid grid-cols-7 w-full border-[1px]  text-center h-[40px]"
                >
                  <div className="text-medium">
                    <label className=" ">
                      {member.FirstName} {member.MiddleName} {member.LastName}{" "}
                      {member.Suffix}
                    </label>
                  </div>
                  <div className="_below_5">
                    <label className="">{member.Birthday}</label>
                  </div>
                  <div className="_below_5">
                    <label className="">{member.Age}</label>
                  </div>
                  <div className="_below_5">
                    <label className="">{member.Gender}</label>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="_below_5">
                      <label className="">{member.Immunization.BCG}</label>
                    </div>
                    <div className="_below_5">
                      <label className="">{member.Immunization.DPT}</label>
                    </div>
                    <div className="_below_5">
                      <label className="">{member.Immunization.Polio}</label>
                    </div>
                    <div className="_below_5">
                      <label className="">{member.Immunization.Measles}</label>
                    </div>
                  </div>
                  <div className="_below_5">
                    <label className="">WEIGHT: {member.Weight}</label>
                  </div>
                  <div className="_below_5">
                    <label className="">HEIGHT: {member.Height}</label>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <Line />

        {/* APARTMENT */}
        <div className="mt-1 mb-2 font-semibold">APARTMENT</div>
        <div className="grid grid-cols-3 w-full px-1 border-[1px] text-start h-[80px]">
        <div className="_container_apartment">
            <label className="">DOOR NO.: {item.Apartment[0].DoorNo}</label>
          </div>
          <div className="_container_apartment ">
            <label className="">FLOOR NO.: {item.Apartment[0].FloorNo}</label>
          </div>
          <div className="_container_apartment">
            <label className="">NAME OF OWNER: {item.Apartment[0].APTOwner}</label>
          </div>
          <div className="_container_apartment ">
            <label className="">HOUSE TYPE: {item.Apartment[0].HouseType}</label>
          </div>
          <div className="_container_apartment ">
            <label className="">
              HOUSEHOLD TOILETS WITH: {item.Apartment[0].HouseToilet}
            </label>
          </div>
          <div className="_container_apartment ">
            <label className="">
              HOUSEHOLD SOURCE OF WATER: {item.Apartment[0].WaterSource}
            </label>
          </div>
        </div>

        <div className="mt-1 mb-2 font-semibold">HOUSE HOLD USES</div>
        <div className="grid grid-cols-3 gap-1 w-full px-1 border-[1px] text-start h-10">
        <div className="">
    <label className="break-words">
      IODIZED SALT: {item.HouseHoldUses.Iodized ? "Yes" : "NO"}
    </label>
  </div>
  <div className="">
    <label className="break-words">
      FORTIFIED FOOD PRODUCTS: {item.HouseHoldUses.Fortified ? "Yes" : "NO"}
    </label>
  </div>
  <div className="">
    <label className="break-words">
      GARBAGE COLLECTION: {item.HouseHoldUses.Garbage ? "Yes" : "NO"}
    </label>
  </div>
        </div>

        <div className="mt-1 mb-2 font-semibold">PET</div>
        <div className="grid grid-cols-3 gap-1 w-full px-1 border-[1px] text-start h-10">
        <div className="">
            <label className=" break-words">
              CAT:{" "}
              {item.Pet[0].NumberofPet === null
                ? "NONE"
                : item.Pet[0].NumberofPet?.catno === undefined
                  ? "NONE"
                  : item.Pet[0].NumberofPet?.catno}{" "}
            </label>
          </div>

          <div className="">
            <label className=" break-words">
              DOG:{" "}
              {item.Pet[0].NumberofPet === null
                ? "NONE"
                : item.Pet[0].NumberofPet?.dogno === undefined
                  ? "NONE"
                  : item.Pet[0].NumberofPet?.dogno}{" "}
            </label>
          </div>

          <div className="">
            <label className=" break-words">
              NOTE:{" "}
              {item.Pet.Remarks === null || "" ? "NONE" : item.Pet.Remarks}
            </label>
          </div>
        </div>

        <div className="mt-1 mb-2 font-semibold">REMARK</div>
        {item.Note === null || "" ? (
          "NONE"
        ) : (
          <textarea className="w-full bg-transparent" value={item.Note} />
        )}
        <Line />

        <div className="h-5" />

        <div className="grid grid-cols-4 items-center h-10 justify-center text-center w-full">
          <div>
            <label>
              {item.AgentName} {`(${item.AgentId})`}
            </label>
          </div>
          <div>
            <label>{item.RespondentName}</label>
          </div>
          <div className="w-full flex items-center justify-center">
            <img
              src={item.RespondentSignature}
              alt="signature"
              className="h-20"
            />
          </div>
          <div>
            <label>{item.RespondentNumber}</label>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center h-10 text-center font-medium w-full">
          <div>
            <label>MOTHER LEADER</label>
          </div>
          <div>
            <label>RESPONDENT NAME</label>
          </div>
          <div>
            <label>RESPONDENT SIGNATURE</label>
          </div>
          <div>
            <label>RESPONDENT CONTACT NO.</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDF_LAYOUT;

const Line = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%] mb-4 mt-4 h-[1px] bg-zinc-800 bg-opacity-50" />
    </div>
  );
};
