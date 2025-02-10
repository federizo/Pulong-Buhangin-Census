"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { FaGraduationCap, FaRegEdit } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { TbChartPieFilled } from "react-icons/tb";
import { LuAsterisk } from "react-icons/lu";
import { IoChevronBackOutline } from "react-icons/io5";
import { toast } from "../ui/use-toast";
import { updateSingleMember } from "@/lib/api/apiUPDATE";

const AgeComputation = (dob: string): string => {
  const age = moment().diff(dob, "years");
  return age.toString();
};

const MemberModal = ({
  selectedUser,
  setSelectedUser,
  formData,
  setFormData,
}: {
  selectedUser: any;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
}) => {
  const [edit, setEdit] = useState<boolean>(true);
  const originalSelectedUser = useRef(selectedUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedUser((prev: any) => ({ ...prev, [name]: value.toUpperCase() }));

    // Fields that should allow only letters
    const letterOnlyFields = [
      "FirstName",
      "LastName",
      "MiddleName",
      "Suffix",
      "Disability",
      "other",
      "position",
    ];

    const regex = /^[A-Za-z\s]*$/; // Allows only letters and spaces

    if (letterOnlyFields.includes(name)) {
      if (!regex.test(value)) {
        return; // Reject invalid input
      }
    }

    if (name === "Birthday") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      if (selectedDate > currentDate) {
        alert("Future dates are not allowed. Resetting to today's date.");
        setSelectedUser((prev: any) => ({
          ...prev,
          [name]: currentDate.toISOString().split("T")[0], // Reset to current date
        }));
        return;
      }
    }

    if (name === "lactatingmonths") {
      // Allow only numbers, limit to 2 digits, and max value 24
      if (!/^\d{0,2}$/.test(value)) {
        return; // Reject non-numeric or more than 2 digits
      }
      if (parseInt(value) > 24) {
        alert("Lactating months cannot exceed 24 Months.");
        return;
      }
      setSelectedUser((prev: any) => ({
        ...prev,
        LactatingMonths: value,
      }));
      return;
    }

    if (["other", "position"].includes(name)) {
      // Handling nested fields in Occupation
      setSelectedUser((prev: any) => ({
        ...prev,
        Occupation: { ...prev.Occupation, [name]: value.toUpperCase() },
      }));
    } else {
      // Handling regular fields
      setSelectedUser((prev: any) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
  };

  const deepCompare = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleUpdate = () => {
    if (deepCompare(originalSelectedUser.current, selectedUser)) {
      alert("No changes detected.");
      return;
    }

    if (
      selectedUser.Age <= 5 &&
      (selectedUser.Weight.trim() === "" || selectedUser.Height.trim() === "")
    ) {
      toast({
        title: "Fail to Add",
        description: (
          <p className="mt-2 w-[340px] rounded-sm text-md font-medium tracking-wider bg-yellow-500 p-1 text-black">
            Please fill in both height and weight if the member is 5 years old
            or below.
          </p>
        ),
      });
      return;
    }

    const updatedFamMembers = formData.FamMember.map((member: any) =>
      member.MemberId === selectedUser.MemberId
        ? { ...member, ...selectedUser }
        : member
    );

    setFormData((prev: any) => ({
      ...prev,
      FamMember: updatedFamMembers,
    }));
    setSelectedUser([]);

    alert("Update member successful.");
    originalSelectedUser.current = { ...selectedUser }; // Update reference with latest data
  };

  const handleBack = () => {
    setSelectedUser([]);
    setEdit(true);
  };
  const handleClose = () => {
    setSelectedUser(null);
  };
  const handleremovemember = () => {
    const updatedFamMembers = formData.FamMember.filter(
      (member: any) => member.MemberId !== selectedUser.MemberId
    );

    setFormData((prev: any) => ({
      ...prev,
      FamMember: updatedFamMembers,
    }));

    setSelectedUser([]);
  };

  if (!selectedUser || Object.keys(selectedUser).length === 0) return null;

  return (
    <div className="w-screen h-screen flex justify-center items-center inset-0 fixed backdrop-blur-sm p-[5vh] z-50">
      <div className="bg-white dark:bg-zinc-900 flex-col flex gap-y-5 lg:w-[70vh] w-full h-full rounded-md shadow-md shadow-slate-950 border-[0.5px] py-5 px-3 z-0 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="flex w-2 items-center group hover:text-red-500">
            <button onClick={() => handleClose()} className="text-3xl">
              <IoChevronBackOutline />
            </button>
            <label className="group-hover:text-base text-[0px]  duration-100">
              Back
            </label>
          </div>
          <div className="flex gap-3">
            {!edit && (
              <>
                <button
                  onClick={handleUpdate}
                  className="border-[1px] duration-300 px-5 py-1 rounded-md flex gap-1 items-center hover:bg-green-600"
                >
                  UPDATE
                </button>

                <button
                  onClick={handleremovemember}
                  className="border-[1px] duration-300 px-5 py-1 rounded-md flex gap-1 items-center hover:bg-red-600"
                >
                  REMOVE
                </button>
              </>
            )}
            <button
              onClick={() => setEdit(!edit)}
              className="border-[1px] duration-300 hover:bg-blue-600 px-5 py-1 rounded-md flex gap-1 items-center"
            >
              <FaRegEdit />
              EDIT
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="px-2 rounded bg-slate-200 text-black w-fit ]"></label>
          <label className="font-thin tracking-wider  bg-slate-500 bg-opacity-50 text-slate-400 w-fit h-fit px-2 rounded"></label>
        </div>
        <div className="flex w-full justify-between items-center">
          <label className="font-semibold  flex items-center gap-2">
            <IoPerson />
            {selectedUser.FirstName} {selectedUser.LastName}
          </label>
        </div>

        <>
          <div className="flex flex-col gap-5 w-full mt-5">
            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light tracking-wider italic text-[1rem] flex">
                <LuAsterisk className="text-red-500 text-[0.8rem]" />
                SURNAME
              </label>

              <input
                disabled={edit}
                type="text"
                name="LastName"
                value={selectedUser.LastName}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>

            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1rem] flex">
                <LuAsterisk className="text-red-500 text-[0.8rem]" />
                FIRSTNAME
              </label>
              <input
                disabled={edit}
                type="text"
                name="FirstName"
                value={selectedUser.FirstName}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>

            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1rem]">
                MIDDLE INITIAL
              </label>
              <input
                disabled={edit}
                type="text"
                name="MiddleName"
                value={selectedUser.MiddleName}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>
            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1rem]">
                SUFFIX
              </label>
              <input
                disabled={edit}
                type="text"
                name="Suffix"
                value={selectedUser.Suffix}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="font-semibold tracking-wider flex">
                <LuAsterisk className="text-red-500 text-[0.8rem]" />
                RELATIONSHIP
              </label>
              <Select
                disabled={edit}
                name="FamilyRelationship"
                value={selectedUser.FamilyRelationship}
                onValueChange={(value) =>
                  setSelectedUser((prev: any) => ({
                    ...prev,
                    FamilyRelationship: value,
                  }))
                }
              >
                <SelectTrigger className="w-[180px]  rounded">
                  <SelectValue placeholder="Choose Relationship" />
                </SelectTrigger>
                <SelectContent className=" ">
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

              <div className="flex flex-col w-full gap-3">
                <label className="font-semibold tracking-wider flex">
                  <LuAsterisk className="text-red-500 text-[0.8rem]" />
                  DATE OF BIRTH
                </label>
                <input
                  disabled={edit}
                  type="date"
                  name="Birthday"
                  value={selectedUser.Birthday}
                  onChange={handleChange}
                  className="border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl uppercase"
                />
              </div>

              <div className="flex flex-col w-full gap-3">
                <label className="font-semibold tracking-wider flex">
                  <LuAsterisk className="text-red-500 text-[0.8rem]" />
                  AGE
                </label>
                <label className=" border-[0.5px] bg-transparent p-2 w-[60px] h-[40px] rounded">
                  {selectedUser.Birthday !== "" &&
                    AgeComputation(selectedUser.Birthday)}
                </label>
              </div>

              <div className="flex flex-col w-full gap-3">
                <label className="font-semibold tracking-wider flex">
                  <LuAsterisk className="text-red-500 text-[0.8rem]" />
                  GENDER
                </label>
                <Select
                  disabled={edit}
                  name="Gender"
                  value={selectedUser.Gender}
                  onValueChange={(value) =>
                    setSelectedUser((prev: any) => ({ ...prev, Gender: value }))
                  }
                >
                  <SelectTrigger className="w-[180px] k rounded">
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
                  disabled={edit}
                  name="civilstatus"
                  value={selectedUser.CivilStatus}
                  onValueChange={(value) =>
                    setSelectedUser((prev: any) => ({
                      ...prev,
                      CivilStatus: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]  rounded">
                    <SelectValue placeholder="Choose Civil Status" />
                  </SelectTrigger>
                  <SelectContent className=" ">
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Li">LI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col w-full gap-3">
                <label className="font-semibold tracking-wider">
                  OCCUPATION
                </label>
                <Select
                  disabled={edit}
                  name="Occupation"
                  value={selectedUser.Occupation?.value}
                  onValueChange={(value) =>
                    setSelectedUser((prev: any) => ({
                      ...prev,
                      Occupation: { ...prev.Occupation, value }, // Correctly update only the value
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px] rounded">
                    <SelectValue placeholder="Choose Occupation" />
                  </SelectTrigger>
                  <SelectContent className=" ">
                    <SelectItem value="GE">
                      {"(GE)"} Government Employee
                    </SelectItem>
                    <SelectItem value="PE">
                      {"(PE)"} Private Employee
                    </SelectItem>
                    <SelectItem value="OFW">
                      {"(OFW)"} Overseas Filipino Worker
                    </SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUser.Occupation?.value === "OTHER" && (
                  <input
                    disabled={edit}
                    type="text"
                    name="other" // Must match the name used in handleChange
                    placeholder="Enter custom occupation"
                    value={selectedUser.Occupation.other}
                    onChange={handleChange}
                    className="p-2.5 rounded"
                  />
                )}
              </div>
            </div>
          </div>
        </>

        <>
          <label className="font-semibold mt-5 flex items-center gap-2">
            <FaGraduationCap />
            EDUCATION{" "}
          </label>

          <div className="flex flex-col gap-5">
            {/* ELEMENTARY */}
            <div className="flex gap-2 items-center">
              <input
                disabled={edit}
                type="radio"
                name="education"
                value="ELEMENTARY GRADUATE"
                checked={selectedUser.Education === "ELEMENTARY GRADUATE"}
                onChange={(e) =>
                  setSelectedUser((prev: any) => ({
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
                disabled={edit}
                type="radio"
                name="education"
                value="HIGH SCHOOL GRADUATE"
                checked={selectedUser.Education === "HIGH SCHOOL GRADUATE"}
                onChange={(e) =>
                  setSelectedUser((prev: any) => ({
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
                disabled={edit}
                type="radio"
                name="education"
                value="COLLEGE GRADUATE"
                checked={selectedUser.Education === "COLLEGE GRADUATE"}
                onChange={(e) =>
                  setSelectedUser((prev: any) => ({
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
                disabled={edit}
                type="radio"
                name="education"
                value="OTHERS"
                checked={selectedUser.Education === "OTHERS"}
                onChange={(e) =>
                  setSelectedUser((prev: any) => ({
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
            {selectedUser.Education === "OTHERS" && (
              <input
                disabled={edit}
                type="text"
                placeholder="Specify your education level"
                className="border px-3 py-2 rounded-md uppercase"
                value={selectedUser.OtherEducation || ""}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  ); // Remove numbers & special characters
                  setSelectedUser((prev: any) => ({
                    ...prev,
                    OtherEducation: onlyLetters.toUpperCase(), // Convert to uppercase
                  }));
                }}
              />
            )}
          </div>
        </>
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
                  disabled={edit}
                  checked={selectedUser.Religion?.value === religion.value}
                  onChange={(e) =>
                    setSelectedUser((prev: any) => ({
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
          {selectedUser.Religion?.value === "OTHER" && (
            <input
              disabled={edit}
              type="text"
              name="otherReligion"
              placeholder="Enter custom religion"
              value={selectedUser.Religion?.other || ""}
              onChange={(e) => {
                const validText = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove numbers & special characters
                setSelectedUser((prev: any) => ({
                  ...prev,
                  Religion: { ...prev.Religion, other: validText },
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && selectedUser.Religion?.other.trim()) {
                  setSelectedUser((prev: any) => ({
                    ...prev,
                    Religion: { ...prev.Religion, value: prev.Religion.other }, // Save input as selected value
                  }));
                }
              }}
              className="p-2.5 rounded border border-gray-400"
            />
          )}
        </div>

        <>
          <div className="flex w-full flex-col gap-5 ">
            <label className="font-semibold flex items-center gap-2 mt-2 pr-3 border-r-[1px] ">
              <TbChartPieFilled />
              SECTOR
            </label>
            <div className="flex gap-2 items-center">
              <label className="font-semibold tracking-wider">Sr.C</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="src"
                checked={selectedUser.Sector?.src}
                onCheckedChange={(value: boolean) =>
                  setSelectedUser((prev: any) => ({
                    ...prev,
                    Sector: { ...prev.Sector, src: value }, // Directly set based on the boolean value
                  }))
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-semibold tracking-wider">SP</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="sp"
                checked={selectedUser.Sector?.sp}
                onCheckedChange={(value: boolean) =>
                  setSelectedUser((prev: any) => ({
                    ...prev,
                    Sector: { ...prev.Sector, sp: value }, // Directly set based on the boolean value
                  }))
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-semibold tracking-wider">4PS</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="fourps"
                checked={selectedUser.Sector?.fourps}
                onCheckedChange={(value: boolean) =>
                  setSelectedUser((prev: any) => ({
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
                disabled={edit}
                type="text"
                name="Disability"
                placeholder="Enter PWD Specification"
                value={selectedUser.Disability}
                onChange={handleChange}
                className="p-1  rounded"
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
                  checked={selectedUser.Lactating === "yes"}
                  disabled={edit} // Disable in view mode
                  onChange={() =>
                    setSelectedUser((prev: any) => ({
                      ...prev,
                      Lactating: "yes",
                      LactatingMonths: "", // Reset input when selecting Yes
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
                  checked={selectedUser.Lactating === "no"}
                  disabled={edit} // Disable in view mode
                  onChange={() =>
                    setSelectedUser((prev: any) => ({
                      ...prev,
                      Lactating: "no",
                      LactatingMonths: "", // Reset months input when selecting No
                    }))
                  }
                  className="h-5 w-5"
                />
                No
              </label>

              {/* Input Field for Months (Only Appears When "Yes" is Selected) */}
              {selectedUser.Lactating === "yes" && (
                <input
                  type="text"
                  name="lactatingmonths"
                  placeholder="Enter Months (Max 24)"
                  value={selectedUser.LactatingMonths}
                  disabled={edit} // Disable input if edit mode is off
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers

                    if (value.length > 2) return; // Limit to 2 digits
                    if (parseInt(value, 10) > 24) return; // Max value = 24

                    setSelectedUser((prev: any) => ({
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
        {selectedUser.Age <= 5 && (
          <>
            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1.3rem] flex item-center gap-1">
                IMMUNIZATION
              </label>
              <div className="gap-4 flex flex-col mt-1">
                <div className="flex items-center gap-2">
                  <label className="tracking-widest">BCG</label>
                  <Checkbox
                    className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                    name="BCG"
                    checked={selectedUser.Immunization.BCG}
                    onCheckedChange={(value: boolean) =>
                      setSelectedUser((prev: any) => ({
                        ...prev,
                        Immunization: { ...prev.Immunization, BCG: value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="tracking-widest">DPT</label>
                  <input
                    type="number"
                    name="DPT"
                    value={selectedUser.Immunization.DPT}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                        setSelectedUser((prev: any) => ({
                          ...prev,
                          Immunization: { ...prev.Immunization, DPT: value },
                        }));
                      }
                    }}
                    className=" border-[0.5px] bg-transparent p-2 rounded w-[100px] max-w-2xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="tracking-widest">POLIO</label>
                  <input
                    type="number"
                    name="Polio"
                    maxLength={1}
                    value={selectedUser.Immunization.Polio}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                        setSelectedUser((prev: any) => ({
                          ...prev,
                          Immunization: { ...prev.Immunization, Polio: value },
                        }));
                      }
                    }}
                    className=" border-[0.5px] bg-transparent p-2 rounded w-[100px] max-w-2xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="tracking-widest">MEASLES</label>
                  <input
                    type="number"
                    name="Measles"
                    maxLength={1}
                    value={selectedUser.Immunization.Measles}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1 && /^[0-9]?$/.test(value)) {
                        setSelectedUser((prev: any) => ({
                          ...prev,
                          Immunization: {
                            ...prev.Immunization,
                            Measles: value,
                          },
                        }));
                      }
                    }}
                    className=" border-[0.5px] bg-transparent p-2 rounded w-[100px] max-w-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1rem] flex gap-1 items-center">
                WEIGHT{" (KG)"}{" "}
                <LuAsterisk className="text-red-500 text-[0.8rem]" />
              </label>
              <input
                disabled={edit}
                type="text"
                name="Weight"
                value={selectedUser.Weight}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>
            <div className="flex flex-col gap-0.5  w-full">
              <label className="font-light  tracking-wider italic text-[1rem] flex gap-1 items-center">
                HEIGHT{" (FT)"}{" "}
                <LuAsterisk className="text-red-500 text-[0.8rem]" />
              </label>
              <input
                disabled={edit}
                type="text"
                name="Height"
                value={selectedUser.Height}
                onChange={handleChange}
                className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberModal;
