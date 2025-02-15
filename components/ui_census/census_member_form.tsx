"use client";

import { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IoPerson } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import {
  TbChartPieFilled,
  TbArrowsMaximize,
  TbArrowsDiagonalMinimize2,
} from "react-icons/tb";
import { LuAsterisk } from "react-icons/lu";

import { v4 as uuidv4 } from "uuid";
// const AgeComputation = (dob: string): string => {
//   const age = moment().diff(dob, "years");
//   return age.toString();
// };

// const AgeComputation = (dob: string): string => {
//     const age = moment().diff(dob, "years");

//   const today = moment();
//   const birthDate = moment(dob);

//   // Prevent negative age if date is in the future
//   return age < 0 ? "0" : age.toString();
// };

const AgeComputation = (dob: string): number => {
  const today = moment();
  const birthDate = moment(dob);

  if (birthDate.isAfter(today)) {
    return 0; // Prevent future dates
  }

  const age = today.diff(birthDate, "years");
  return age < 0 ? 0 : age;
};

const CensusMemberForm = ({
  formData,
  setFormData,
  memberForm,
  setMemberForm,
  minimizeForm,
  setMinimizeForm,
}: {
  minimizeForm: boolean;
  setMinimizeForm: React.Dispatch<React.SetStateAction<boolean>>;
  memberForm: any;
  setMemberForm: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const today = moment().format("YYYY-MM-DD");

    if (name === "Birthday") {
      // ✅ Prevent future dates
      if (moment(value).isAfter(today)) {
        alert("Future dates are not allowed. Resetting to today's date.");

        setMemberForm((prev: any) => ({
          ...prev,
          [name]: today,
          Age: AgeComputation(today),
        }));
        return;
      }

      // 🎯 Set the valid date and compute age
      setMemberForm((prev: any) => ({
        ...prev,
        [name]: value,
        Age: AgeComputation(value),
      }));
    } else {
      // 🔡 For other inputs, convert to uppercase
      setMemberForm((prev: any) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
  };

  // 3️⃣ Auto Update Age When Birthday Changes
  useEffect(() => {
    if (memberForm.Birthday !== "") {
      const age = AgeComputation(memberForm.Birthday);
      setMemberForm((prev: any) => ({ ...prev, Age: age }));
    }
  }, [memberForm.Birthday]);

  // 4️⃣ Auto Generate Member ID When Form Data Changes
  useEffect(() => {
    setMemberForm((prev: any) => ({ ...prev, MemberId: uuidv4() }));
  }, [formData]);

  return (
    <div
      className={`${
        minimizeForm ? " max-h-fit" : "h-[50px]"
      } duration-300 flex flex-col gap-2 overflow-hidden w-5xl px-3 py-2 rounded border-[0.5px] border-gray-500 text-black dark:text-white`}
    >
      <div className="flex items-center justify-between">
        <label className="px-2 rounded bg-slate-200 text-black w-fit ]"></label>
        <label className="font-thin tracking-wider  bg-slate-500 bg-opacity-50 text-slate-400 w-fit h-fit px-2 rounded"></label>
      </div>
      <div
        onClick={() => setMinimizeForm(!minimizeForm)}
        className="flex w-full justify-between items-center"
      >
        <label className="font-semibold  flex items-center gap-2">
          <IoPerson />
          {memberForm.FirstName && memberForm.LastName ? (
            <span>
              {memberForm.FirstName} {memberForm.LastName}
            </span>
          ) : (
            ""
          )}
        </label>

        <a
          onClick={() => setMinimizeForm(!minimizeForm)}
          className="text-[1.2rem] cursor-pointer hover:text-blue-500"
        >
          {minimizeForm ? <TbArrowsDiagonalMinimize2 /> : <TbArrowsMaximize />}
        </a>
      </div>

      <div className="flex flex-col gap-5 w-full mt-5">
        <div className="flex flex-col gap-0.5 w-full">
          <label className="font-light tracking-wider italic text-[1rem] flex">
            <LuAsterisk className="text-red-500 text-[0.8rem]" />
            SURNAME
          </label>

          <input
            type="text"
            name="LastName"
            value={memberForm.LastName}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[A-Z\s]*$/.test(input)) {
                // Allow only uppercase letters and spaces
                handleChange(e); // Trigger the existing handleChange for state management
              }
            }}
            className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
          />
        </div>

        <div className="flex flex-col gap-0.5  w-full">
          <label className="font-light  tracking-wider italic text-[1rem] flex">
            <LuAsterisk className="text-red-500 text-[0.8rem]" />
            FIRSTNAME
          </label>
          <input
            type="text"
            name="FirstName"
            value={memberForm.FirstName}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[A-Z\s]*$/.test(input)) {
                // Allow only uppercase letters and spaces
                handleChange(e); // Trigger the existing handleChange for state management
              }
            }}
            className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
          />
        </div>

        <div className="flex flex-col gap-0.5  w-full">
          <label className="font-light  tracking-wider italic text-[1rem]">
            MIDDLE INITIAL
          </label>
          <input
            type="text"
            name="MiddleName"
            value={memberForm.MiddleName}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[A-Z\s]*$/.test(input)) {
                // Allow only uppercase letters and spaces
                handleChange(e); // Trigger the existing handleChange for state management
              }
            }}
            className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col gap-0.5  w-full">
          <label className="font-light  tracking-wider italic text-[1rem]">
            SUFFIX
          </label>
          <input
            type="text"
            name="Suffix"
            value={memberForm.Suffix}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (/^[A-Z\s]*$/.test(input)) {
                // Allow only uppercase letters and spaces
                handleChange(e); // Trigger the existing handleChange for state management
              }
            }}
            className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="font-semibold tracking-wider flex">
            <LuAsterisk className="text-red-500 text-[0.8rem]" />
            RELATIONSHIP
          </label>
          <Select
            name="FamilyRelationship"
            value={memberForm.FamilyRelationship}
            onValueChange={(value) =>
              setMemberForm((prev: any) => ({
                ...prev,
                FamilyRelationship: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]  rounded">
              <SelectValue placeholder="Choose Relationship" />
            </SelectTrigger>
            <SelectContent className=" h-[300px] overflow-y-auto">
              <SelectItem value="father">Father</SelectItem>
              <SelectItem value="mother">Mother</SelectItem>
              <SelectItem value="son">Son</SelectItem>
              <SelectItem value="daughter">Daughter</SelectItem>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="sister">Sister</SelectItem>
              <SelectItem value="grandfather">Grandfather</SelectItem>
              <SelectItem value="grandmother">Grandmother</SelectItem>
              <SelectItem value="grandson">Grandson</SelectItem>
              <SelectItem value="granddaughter">Granddaughter</SelectItem>
              <SelectItem value="uncle">Uncle</SelectItem>
              <SelectItem value="aunt">Aunt</SelectItem>
              <SelectItem value="nephew">Nephew</SelectItem>
              <SelectItem value="niece">Niece</SelectItem>
              <SelectItem value="cousin">Cousin</SelectItem>
              <SelectItem value="stepfather">Stepfather</SelectItem>
              <SelectItem value="stepmother">Stepmother</SelectItem>
              <SelectItem value="stepson">Stepson</SelectItem>
              <SelectItem value="stepdaughter">Stepdaughter</SelectItem>
              <SelectItem value="half-brother">Half-Brother</SelectItem>
              <SelectItem value="half-sister">Half-Sister</SelectItem>
              <SelectItem value="father-in-law">Father-in-Law</SelectItem>
              <SelectItem value="mother-in-law">Mother-in-Law</SelectItem>
              <SelectItem value="brother-in-law">Brother-in-Law</SelectItem>
              <SelectItem value="sister-in-law">Sister-in-Law</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <label className="font-semibold tracking-wider flex">
          <LuAsterisk className="text-red-500 text-[0.8rem]" />
          DATE OF BIRTH
        </label>
        <div className="flex flex-col -pt-3">
          <label className="pl-2 italic text-gray-600">Month/Day/Year</label>
          <input
            type="date"
            data-date-format="MM DD YYYY"
            name="Birthday"
            onChange={handleChange}
            value={memberForm.Birthday}
            max={moment().format("YYYY-MM-DD")} // Restrict to today's date
            className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl uppercase"
          />
        </div>

        {/* Age Display */}
        <div className="flex flex-col w-full gap-3">
          <label className="font-semibold tracking-wider flex">
            <span className="text-red-500 text-[0.8rem]">*</span> AGE
          </label>
          <input
            type="text"
            value={memberForm.Age}
            readOnly
            className=" bg-transparent p-2 w-[60px] h-[40px] rounded"
          />
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="font-semibold tracking-wider flex">
            <LuAsterisk className="text-red-500 text-[0.8rem]" />
            GENDER
          </label>
          <Select
            name="Gender"
            value={memberForm.Gender}
            onValueChange={(value) =>
              setMemberForm((prev: any) => ({ ...prev, Gender: value }))
            }
          >
            <SelectTrigger className="w-[180px] border-[0.5px] border-gray-600 dark:border-gray-100 rounded">
              <SelectValue placeholder="Choose Gender" />
            </SelectTrigger>
            <SelectContent className=" ">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-full gap-3">
          <label className="font-semibold tracking-wider flex">
            <LuAsterisk className="text-red-500 text-[0.8rem]" />
            CIVIL STATUS
          </label>
          <Select
            name="civilstatus"
            value={memberForm.CivilStatus}
            onValueChange={(value) =>
              setMemberForm((prev: any) => ({
                ...prev,
                CivilStatus: value,
              }))
            }
          >
            <SelectTrigger className="w-[180px] border-[0.5px] border-gray-600 dark:border-gray-100  rounded">
              <SelectValue placeholder="Choose Civil Status" />
            </SelectTrigger>
            <SelectContent className=" ">
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Li">LI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {memberForm.Age >= 5 && (
          <div className="flex flex-col w-full gap-3">
            <label className="font-semibold tracking-wider">OCCUPATION</label>
            <Select
              name="Occupation"
              value={memberForm.Occupation?.value}
              onValueChange={(value) =>
                setMemberForm((prev: any) => ({
                  ...prev,
                  Occupation: { ...prev.Occupation, value }, // Correctly update only the value
                }))
              }
            >
              <SelectTrigger className="w-[180px] rounded">
                <SelectValue placeholder="Choose Occupation" />
              </SelectTrigger>
              <SelectContent className=" ">
                <SelectItem value="GE">{"(GE)"} Government Employee</SelectItem>
                <SelectItem value="PE">{"(PE)"} Private Employee</SelectItem>
                <SelectItem value="OFW">
                  {"(OFW)"} Overseas Filipino Worker
                </SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
            {memberForm.Occupation?.value === "OTHER" && (
              <input
                type="text"
                name="other"
                placeholder="Enter custom occupation"
                value={memberForm.Occupation.other}
                onChange={(e) =>
                  setMemberForm((prev: any) => ({
                    ...prev,
                    Occupation: { ...prev.Occupation, other: e.target.value }, // Correctly update only the other field
                  }))
                }
                className="p-2.5 rounded"
              />
            )}
            {memberForm.Occupation?.value !== "" && (
              <input
                type="text"
                name="other"
                placeholder="Enter work position"
                value={memberForm.Occupation.position}
                onChange={(e) =>
                  setMemberForm((prev: any) => ({
                    ...prev,
                    Occupation: {
                      ...prev.Occupation,
                      position: e.target.value,
                    }, // Correctly update only the other field
                  }))
                }
                className="p-2.5 rounded"
              />
            )}
          </div>
        )}
      </div>

      <>
        {memberForm.Age >= 5 && (
          <>
            <label className="font-semibold mt-5 flex items-center gap-2">
              <FaGraduationCap />
              EDUCATION{" "}
            </label>

            <div className="flex flex-col gap-5">
              {/* ELEMENTARY */}
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="education"
                  value="ELEMENTARY GRADUATE"
                  checked={memberForm.Education === "ELEMENTARY GRADUATE"}
                  onChange={(e) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Education: e.target.value,
                      OtherEducation: "", // Reset other field when another option is selected
                    }))
                  }
                />
                <label className="font-semibold tracking-wider">
                  ELEMENTARY GRADUATE
                </label>
              </div>

              {/* HIGH SCHOOL */}
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="education"
                  value="HIGH SCHOOL GRADUATE"
                  checked={memberForm.Education === "HIGH SCHOOL GRADUATE"}
                  onChange={(e) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Education: e.target.value,
                      OtherEducation: "",
                    }))
                  }
                />
                <label className="font-semibold tracking-wider">
                  HIGH SCHOOL GRADUATE
                </label>
              </div>

              {/* COLLEGE */}
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="education"
                  value="COLLEGE GRADUATE"
                  checked={memberForm.Education === "COLLEGE GRADUATE"}
                  onChange={(e) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Education: e.target.value,
                      OtherEducation: "",
                    }))
                  }
                />
                <label className="font-semibold tracking-wider">
                  COLLEGE GRADUATE
                </label>
              </div>

              {/* OTHERS - SHOW TEXTBOX IF SELECTED */}
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="education"
                  value="OTHERS"
                  checked={memberForm.Education === "OTHERS"}
                  onChange={(e) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Education: e.target.value,
                    }))
                  }
                />
                <label className="font-semibold tracking-wider">
                  OTHERS OSC/OSY
                </label>
              </div>

              {/* TEXTBOX APPEARS WHEN "OTHERS" IS SELECTED */}
              {memberForm.Education === "OTHERS" && (
                <input
                  type="text"
                  placeholder="Specify your education level"
                  className="border px-3 py-2 rounded-md uppercase"
                  value={memberForm.OtherEducation || ""}
                  onChange={(e) => {
                    const onlyLetters = e.target.value.replace(
                      /[^A-Za-z\s]/g,
                      ""
                    ); // Remove numbers & special characters
                    setMemberForm((prev: any) => ({
                      ...prev,
                      OtherEducation: onlyLetters.toUpperCase(), // Convert to uppercase
                    }));
                  }}
                />
              )}
            </div>
          </>
        )}

        <div className="flex flex-col w-full gap-3">
          <label className="font-semibold flex items-center gap-2">
            <GiWhiteBook />
            RELIGION
          </label>

          {/* Radio Button Options */}
          <div className="flex flex-col gap-2">
            {[
              { value: "RC", label: "(RC) Roman Catholic" },
              { value: "INC", label: "(INC) Iglesia Ni Cristo" },
              { value: "BC", label: "(BC) Bible Baptist Church" },
              { value: "OTHER", label: "Other" },
            ].map((religion) => (
              <label key={religion.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="Religion"
                  value={religion.value}
                  checked={memberForm.Religion?.value === religion.value}
                  onChange={(e) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Religion: {
                        value: e.target.value,
                        other:
                          e.target.value === "OTHER"
                            ? prev.Religion?.other || ""
                            : "", // Reset "other" if not selected
                      },
                    }))
                  }
                  className="w-4 h-4"
                />
                {religion.label}
              </label>
            ))}
          </div>

          {/* Show "Other" Input if Selected */}
          {memberForm.Religion?.value === "OTHER" && (
            <input
              type="text"
              name="otherReligion"
              placeholder="Enter custom religion"
              value={memberForm.Religion?.other || ""}
              onChange={(e) => {
                const validText = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove numbers & special characters
                setMemberForm((prev: any) => ({
                  ...prev,
                  Religion: { ...prev.Religion, other: validText },
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && memberForm.Religion?.other.trim()) {
                  setMemberForm((prev: any) => ({
                    ...prev,
                    Religion: { ...prev.Religion, value: prev.Religion.other }, // Save input as selected value
                  }));
                }
              }}
              className="p-2.5 rounded border border-gray-400"
            />
          )}
        </div>
        {memberForm.Age >= 5 && (
          <>
            <div className="flex w-full flex-col gap-5 ">
              <label className="font-semibold flex items-center gap-2 mt-2 pr-3 border-r-[1px] ">
                <TbChartPieFilled />
                SECTOR
              </label>
              <div className="flex gap-2 items-center">
                <label className="font-semibold tracking-wider">Sr.C</label>
                <Checkbox
                  className="h-6 w-6"
                  name="src"
                  checked={memberForm.Sector?.src}
                  onCheckedChange={(value: boolean) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Sector: { ...prev.Sector, src: value }, // Directly set based on the boolean value
                    }))
                  }
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="font-semibold tracking-wider">SP</label>
                <Checkbox
                  className="h-6 w-6"
                  name="sp"
                  checked={memberForm.Sector?.sp}
                  onCheckedChange={(value: boolean) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Sector: { ...prev.Sector, sp: value }, // Directly set based on the boolean value
                    }))
                  }
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="font-semibold tracking-wider">4PS</label>
                <Checkbox
                  className="h-6 w-6"
                  name="fourps"
                  checked={memberForm.Sector?.fourps}
                  onCheckedChange={(value: boolean) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Sector: { ...prev.Sector, fourps: value }, // Directly set based on the boolean value
                    }))
                  }
                />
              </div>

              <div className="flex gap-2 items-center">
                <label className="font-semibold tracking-wider">
                  PWD{" (SPECIFY)"}
                </label>
                <input
                  type="text"
                  name="Disability"
                  placeholder="Enter PWD Specification"
                  value={memberForm.Disability}
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Remove numeric characters
                    value = value.replace(/[0-9]/g, "");

                    // 2️⃣ Convert text to uppercase
                    value = value.toUpperCase();

                    // 3️⃣ Update state with valid uppercase, non-numeric value
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Disability: value,
                    }));
                  }}
                  className="p-1 rounded"
                />
              </div>

              <div className="flex gap-2 items-center">
                <label className="font-semibold tracking-wider">
                  LACTATING {"(0-24 MONTHS)"}
                </label>

                {/* Radio Button for "Yes" */}
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="lactatingstatus"
                    value="yes"
                    checked={memberForm.Lactating === true} // Ensures correct selection
                    onChange={() =>
                      setMemberForm((prev: any) => ({
                        ...prev,
                        Lactating: true,
                        LactatingMonths: "", // Reset input when selected
                      }))
                    }
                    className="h-5 w-5"
                  />
                  Yes
                </label>

                {/* Radio Button for "No" */}
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="lactatingstatus"
                    value="no"
                    checked={memberForm.Lactating === false} // Ensures correct selection
                    onChange={() =>
                      setMemberForm((prev: any) => ({
                        ...prev,
                        Lactating: false,
                        LactatingMonths: "", // Clear months input
                      }))
                    }
                    className="h-5 w-5"
                  />
                  No
                </label>

                {/* Input Field for Months (Visible Only When "Yes" is Selected) */}
                {memberForm.Lactating && (
                  <input
                    type="text"
                    name="lactatingmonths"
                    placeholder="Enter Months (0-24)"
                    value={memberForm.LactatingMonths}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers

                      if (value.length > 2) return; // Limit to 2 digits
                      if (parseInt(value, 10) > 24) return; // Max value = 24

                      setMemberForm((prev: any) => ({
                        ...prev,
                        LactatingMonths: value,
                      }));
                    }}
                    className="p-1 border rounded w-[60px] text-center"
                    maxLength={2} // Extra safeguard
                  />
                )}
              </div>
            </div>
          </>
        )}
      </>
      {memberForm.Age <= 5 && (
        <>
          <div className="flex flex-col gap-0.5  w-full">
            <label className="font-light  tracking-wider italic text-[1rem] flex items-center">
              IMMUNIZATION
            </label>
            <div className="gap-4 flex flex-col mt-1">
              <div className="flex items-center gap-2">
                <label className="tracking-widest">BCG</label>
                <Checkbox
                  className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                  name="BCG"
                  checked={memberForm.Immunization.BCG}
                  onCheckedChange={(value: boolean) =>
                    setMemberForm((prev: any) => ({
                      ...prev,
                      Immunization: { ...prev.Immunization, BCG: value },
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="tracking-widest">DPT</label>
                <input
                  type="text"
                  name="DPT"
                  value={memberForm.Immunization.DPT}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                      setMemberForm((prev: any) => ({
                        ...prev,
                        Immunization: { ...prev.Immunization, DPT: value },
                      }));
                    }
                  }}
                  className=" border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-[100px] max-w-2xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="tracking-widest">POLIO</label>
                <input
                  type="text"
                  name="Polio"
                  maxLength={1}
                  value={memberForm.Immunization.Polio}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                      setMemberForm((prev: any) => ({
                        ...prev,
                        Immunization: { ...prev.Immunization, Polio: value },
                      }));
                    }
                  }}
                  className=" border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-[100px] max-w-2xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="tracking-widest">MEASLES</label>
                <input
                  type="text"
                  name="Measles"
                  maxLength={1}
                  value={memberForm.Immunization.Measles}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                      setMemberForm((prev: any) => ({
                        ...prev,
                        Immunization: { ...prev.Immunization, Measles: value },
                      }));
                    }
                  }}
                  className=" border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-[100px] max-w-2xl"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 w-full">
            <label className="font-light tracking-wider italic text-[1rem] flex">
              <LuAsterisk className="text-red-500 text-[0.8rem]" /> WEIGHT{" "}
              {" (KG) "}
            </label>
            <input
              type="text" // Using text for better validation control
              name="Weight"
              value={memberForm.Weight}
              onChange={(e) => {
                const input = e.target.value;
                // Allow up to 3 digits before the dot, optional dot, and up to 2 digits after
                if (/^\d{0,6}(\.\d{0,2})?$/.test(input)) {
                  handleChange(e);
                }
              }}
              className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
              maxLength={7} // Max 7 characters including the dot
              placeholder="e.g., 408.23"
            />
          </div>

          <div className="flex flex-col gap-0.5 w-full">
            <label className="font-light tracking-wider italic text-[1rem] flex">
              <LuAsterisk className="text-red-500 text-[0.8rem]" /> HEIGHT{" "}
              {" (FT'IN)"}
            </label>
            <input
              type="text"
              name="Height"
              value={memberForm.Height}
              onChange={(e) => {
                let input = e.target.value;

                // Allow deletion (empty input)
                if (input === "") {
                  handleChange({
                    target: { name: "Height", value: "" },
                  } as React.ChangeEvent<HTMLInputElement>);
                  return;
                }

                // Remove all non-numeric and non-apostrophe characters
                input = input.replace(/[^0-9']/g, "");

                // Ensure only one apostrophe is allowed
                const apostropheCount = (input.match(/'/g) || []).length;
                if (apostropheCount > 1) {
                  input = input.replace(/'+$/, ""); // Remove extra apostrophes at the end
                }

                // Regex pattern: Valid formats like "7", "7'", "7'1", "7'11"
                const heightPattern = /^([1-9])'?(\d{0,2})?$/;

                if (heightPattern.test(input)) {
                  const [feet, inches] = input.split("'");

                  // Validate inches if present
                  if (inches !== undefined && inches !== "") {
                    const inchesValue = parseInt(inches, 10);
                    if (isNaN(inchesValue) || inchesValue > 11) {
                      return; // Block invalid inches > 11
                    }
                  }
                } else {
                  return; // Block invalid input
                }

                // Update state
                handleChange({
                  target: { name: "Height", value: input },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="border-[0.5px] border-gray-600 dark:border-gray-100 bg-transparent p-2 rounded w-full max-w-2xl"
              maxLength={4} // Allows "7'11"
              placeholder="e.g., 7'1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CensusMemberForm;
