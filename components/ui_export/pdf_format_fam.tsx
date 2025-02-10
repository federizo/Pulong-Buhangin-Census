/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { FaRegFilePdf } from "react-icons/fa";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

const generatePDF = async (ref: HTMLDivElement, item: any) => {
  if (!ref || !item || item.length === 0) {
    console.error("❌ Error: No data available for PDF generation.");
    return;
  }

  try {
    console.log("✅ Generating PDF...");

    const pdf = new jsPDF("l", "mm", "legal"); // Landscape, Legal size

    // Extract Table Headers
    const headers: string[] = [
      "F/M/L/Sfx",
      "Relationship",
      "Birthday",
      "Age",
      "Gender",
      "Religion",
      "Education",
      "PWD",
      "Lactating",
    ];

    // Extract Table Rows
    const rows: string[][] = item.map((member: any) => [
      `${member.FirstName} ${member.MiddleName} ${member.LastName}`,
      member.FamilyRelationship || "",
      member.Birthday || "",
      member.Age?.toString() || "",
      member.Gender || "",
      member.Religion && typeof member.Religion === "object"
      ? member.Religion.value === "OTHER"
        ? member.Religion.other || "N/A" // ✅ Show custom input if "Other" was selected
        : member.Religion.value // ✅ Show selected radio button value
      : member.Religion || "N/A",
      member.Education || "", // ✅ Added Education
      member.PWD ? "Yes" : "No", // ✅ Added PWD (boolean handling)
      member.Lactating === "yes" ? "Yes" : "No", // ✅ FIXED
    ]);

    if (headers.length === 0 || rows.length === 0) {
      console.error("❌ Error: Table data is empty.");
      return;
    }

    console.log("✅ Table data extracted. Adding to PDF...");

    // Insert table with proper styling
    autoTable(pdf, {
      head: [headers],
      body: rows,
      theme: "grid",
      startY: 5,
      margin: { top: 5, bottom: 3 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        halign: "center",
        lineWidth: 0.5, // Regular row border width
      },
      headStyles: {
        fillColor: [0, 0, 0], // Black background
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
        lineWidth: 1.5, // Thicker for solid look
      },
      pageBreak: "auto",
    });

    console.log("✅ Saving PDF...");

    // Save the PDF with timestamp
    const fileName = `HOUSEPROFILE_${moment().format("YYYYMMDD_HHmmss")}.pdf`;
    pdf.save(fileName);

    console.log("✅ PDF should be downloading now.");
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
  }
};

const PDF_LAYOUT_FAM = ({ item }: { item: any }) => {
  const divRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className=" overflow-auto ">
      <button
        onClick={() => {
          if (!divRef.current || !item || item.length === 0) {
            console.error("❌ Error: No data to export.");
            return;
          }
          generatePDF(divRef.current, item);
        }}
        disabled={!item || item.length === 0} // Disable button if no data
        className={`border-[1px] duration-300 ${
          item && item.length > 0
            ? "bg-red-400 hover:bg-red-500"
            : "bg-gray-400 cursor-not-allowed"
        } px-5 py-1 rounded-md flex gap-1 items-center`}
      >
        <FaRegFilePdf />
        PDF
      </button>

      {/* FORM */}

      <div
        ref={divRef}
        className="hidden absolute -left-[9999px]" // Hide from UI but keep for PDF
      >
        <table className="border-collapse border w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">F/M/L/Sfx</th>
              <th className="border px-2 py-1">Relationship</th>
              <th className="border px-2 py-1">Birthday</th>
              <th className="border px-2 py-1">Age</th>
              <th className="border px-2 py-1">Gender</th>
              <th className="border px-2 py-1">Religion</th> {/* ✅ Added */}
              <th className="border px-2 py-1">Education</th> {/* ✅ Added */}
              <th className="border px-2 py-1">PWD</th> {/* ✅ Added */}
              <th className="border px-2 py-1">Lactating</th> {/* ✅ Added */}
            </tr>
          </thead>
          <tbody>
            {item?.map((member: any) => (
              <tr key={member.id}>
                <td className="border px-2 py-1">{`${member.FirstName} ${member.MiddleName} ${member.LastName}`}</td>
                <td className="border px-2 py-1">
                  {member.FamilyRelationship || ""}
                </td>
                <td className="border px-2 py-1">{member.Birthday || ""}</td>
                <td className="border px-2 py-1">
                  {member.Age?.toString() || ""}
                </td>
                <td className="border px-2 py-1">{member.Gender || ""}</td>
                <td className="border px-2 py-1">
  {member.Religion && typeof member.Religion === "object"
    ? member.Religion.value === "OTHER"
      ? member.Religion.other || "N/A" // ✅ Show "Other" value
      : member.Religion.value // ✅ Show selected radio button value
    : member.Religion || "N/A"} {/* ✅ Handle string case or empty value */}
</td>



                <td className="border px-2 py-1">
                  {member.Education && typeof member.Education === "object"
                    ? member.Education.value || member.Education.other || "N/A"
                    : "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {member.PWD ? "Yes" : "No"}
                </td>
                <td className="border px-2 py-1">
                  {member.Lactating === "yes" ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
