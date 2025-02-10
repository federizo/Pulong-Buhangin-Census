/* eslint-disable react-hooks/exhaustive-deps */
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
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { GiSaveArrow } from "react-icons/gi";
import { toast } from "@/components/ui/use-toast";
import { updateSingleMember } from "@/lib/api/apiUPDATE";
import { FamMemberDELETE } from "@/lib/api/apiDELETE";
import Consent from "../../(dasboard)/ui/consent_modal";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

const AgeComputation = (dob: string): string => {
  const age = moment().diff(dob, "years");
  return age.toString();
};

const MemberModalFamilyProfile = ({
  item,
  modal,
  setModal,
}: {
  item: any;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedUser, setSelectedUser] = useState<any>({
    MemberId: item.MemberId,
    FirstName: item.FirstName,
    LastName: item.LastName,
    MiddleName: item.MiddleName,
    Suffix: item.Suffix,
    FamilyRelationship: item.FamilyRelationship,
    Birthday: item.Birthday,
    Age: AgeComputation(item.Birthday),
    Gender: item.Gender,
    CivilStatus: item.CivilStatus,
    Occupation: item.Occupation,
    Education: item.Education,
    Religion: item.Religion,
    Sector: item.Sector,
    Lactating: item.Lactating ?? false, // Ensure false if undefined
    LactatingMonths: item.LactatingMonths ?? "",
    Immunization: item.Immunization,
    Disability: item.Disability,
    Weight: item.Weight,
    Height: item.Height,
  });
  const [edit, setEdit] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const orignialData = useRef(selectedUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

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

  const handleUpdate = async (
    selectedUser: any,
    orignialData: React.MutableRefObject<any>
  ) => {
    if (JSON.stringify(selectedUser) === JSON.stringify(orignialData.current)) {
      toast({ title: "No changes detected" });
      return;
    }

    try {
      console.log("Sending Data:", selectedUser); // Log request data
      const response = await updateSingleMember(
        selectedUser,
        orignialData.current
      );
      console.log("API Response:", response); // Log response from API

      // ✅ Check for `msg`, since `message` doesn't exist in the type
      if (response && response.msg) {
        toast({ title: response.msg });

        // ✅ Update original data to prevent unnecessary re-saves
        orignialData.current = { ...selectedUser };

        // ✅ Close edit mode after saving
        setEdit(true);
      } else {
        toast({
          title: "Update failed",
          description: "Unexpected response format",
        });
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast({ title: "Update failed", description: "Something went wrong" });
    }
  };

  const handleCloseModal = () => {
    setModal(!modal);
    setEdit(true);
  };

  const handleDeleteFamilyMember = async () => {
    try {
      setDeleting(true);
      const res = await FamMemberDELETE(
        selectedUser.MemberId,
        item.HouseProfileId
      );

      if (res.success) {
        alert("Family member deleted successfully");

        location.reload();
      } else {
        alert(`Failed to delete family member: ${res.message}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Error deleting family member:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!modal) return null;

  return (
    <div className="inset-0 fixed  w-screen h-full backdrop-blur-sm bg-black bg-opacity-50 flex justify-center p-2 lg:p-10">
      <div className="h-full flex-col w-[70vh] overflow-y-auto dark:bg-zinc-900 bg-white  px-5 py-2 rounded-md shadow-md shadow-slate-950 border-[0.5px] z-0">
        <Consent
          deleteModal={open}
          setDeleteModal={setOpen}
          onConfirm={handleDeleteFamilyMember}
        />

        {deleting ? (
          <div className="w-[99%] h-full flex flex-col gap-6 p-4 relative">
            {/* Personal Information Group */}
            <div className="space-y-4">
              <Skeleton className="w-32 h-6 rounded-md" /> {/* Section Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" />{" "}
                {/* First Name */}
                <Skeleton className="w-full h-10 rounded-lg" />{" "}
                {/* Last Name */}
              </div>
              <Skeleton className="w-3/4 h-10 rounded-lg" /> {/* Email */}
            </div>

            {/* Address Group */}
            <div className="space-y-4">
              <Skeleton className="w-24 h-6 rounded-md" /> {/* Section Label */}
              <Skeleton className="w-full h-10 rounded-lg" />{" "}
              {/* Street Address */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" /> {/* City */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* State */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* ZIP */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* Country */}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-4">
              <Skeleton className="w-40 h-6 rounded-md" /> {/* Section Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-2/3 h-10 rounded-lg" />
              </div>
            </div>

            <div className="absolute backdrop-blur-[2px] flex items-center justify-center w-full h-full tracking-widest text-lg bg-black bg-opacity-65">
              <Spinner
                color="primary"
                label="Please wait don't refresh while processing the deletion..."
                labelColor="primary"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between w-full mb-3">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setEdit(!edit)}
                  className={`${
                    !edit
                      ? "bg-blue-400 hover:bg-blue-700"
                      : "hover:bg-blue-500"
                  } py-1 px-5 border-[1px] border-zinc-800 rounded-md tracking-wide  duration-300 flex items-center gap-1`}
                >
                  <FaRegEdit /> {edit ? "EDIT" : "CANCEL"}
                </button>
                {!edit && (
                  <>
                    <button
                      onClick={() => handleUpdate(selectedUser, orignialData)}
                      className="py-1 px-5 border-[1px] border-zinc-800 rounded-md tracking-wide hover:bg-green-500 duration-300 flex items-center gap-1"
                    >
                      <GiSaveArrow /> UPDATE
                    </button>
                    <button
                      onClick={() => setOpen(!open)}
                      className="py-1 px-5 border-[1px] border-zinc-800 rounded-md tracking-wide hover:bg-red-500 duration-300 flex items-center gap-1"
                    >
                      <MdDelete /> REMOVE
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => handleCloseModal()}
                className="text-[3vh] hover:text-red-500 duration-300 hover:scale-110"
              >
                <IoCloseOutline />
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex w-full justify-between items-center">
                <label className="font-semibold  flex items-center gap-2">
                  <IoPerson />
                  {selectedUser.FirstName}
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
                        <SelectItem value="granddaughter">
                          Granddaughter
                        </SelectItem>
                        <SelectItem value="uncle">Uncle</SelectItem>
                        <SelectItem value="aunt">Aunt</SelectItem>
                        <SelectItem value="nephew">Nephew</SelectItem>
                        <SelectItem value="niece">Niece</SelectItem>
                        <SelectItem value="cousin">Cousin</SelectItem>
                        <SelectItem value="stepfather">Stepfather</SelectItem>
                        <SelectItem value="stepmother">Stepmother</SelectItem>
                        <SelectItem value="stepson">Stepson</SelectItem>
                        <SelectItem value="stepdaughter">
                          Stepdaughter
                        </SelectItem>
                        <SelectItem value="half-brother">
                          Half-Brother
                        </SelectItem>
                        <SelectItem value="half-sister">Half-Sister</SelectItem>
                        <SelectItem value="father-in-law">
                          Father-in-Law
                        </SelectItem>
                        <SelectItem value="mother-in-law">
                          Mother-in-Law
                        </SelectItem>
                        <SelectItem value="brother-in-law">
                          Brother-in-Law
                        </SelectItem>
                        <SelectItem value="sister-in-law">
                          Sister-in-Law
                        </SelectItem>
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
                        onChange={handleChange}
                        value={selectedUser.Birthday}
                        className=" border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl uppercase"
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
                          setSelectedUser((prev: any) => ({
                            ...prev,
                            Gender: value,
                          }))
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
                            {"(OFW)"}Overseas Filipino Worker
                          </SelectItem>
                          <SelectItem value="OTHER">OTHER</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedUser.Occupation?.value === "OTHER" && (
                        <input
                          disabled={edit}
                          type="text"
                          name="other"
                          placeholder="Enter custom occupation"
                          value={selectedUser.Occupation.other}
                          onChange={(e) =>
                            setSelectedUser((prev: any) => ({
                              ...prev,
                              Occupation: {
                                ...prev.Occupation,
                                other: e.target.value,
                              }, // Correctly update only the other field
                            }))
                          }
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
                      type="radio"
                      name="education"
                      value="HIGH SCHOOL GRADUATE"
                      checked={
                        selectedUser.Education === "HIGH SCHOOL GRADUATE"
                      }
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
                    <label
                      key={religion.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="Religion"
                        value={religion.value}
                        disabled={edit}
                        checked={
                          selectedUser.Religion?.value === religion.value
                        }
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
                      const validText = e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ); // Remove numbers & special characters
                      setSelectedUser((prev: any) => ({
                        ...prev,
                        Religion: { ...prev.Religion, other: validText },
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        selectedUser.Religion?.other.trim()
                      ) {
                        setSelectedUser((prev: any) => ({
                          ...prev,
                          Religion: {
                            ...prev.Religion,
                            value: prev.Religion.other,
                          }, // Save input as selected value
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

                  <div className="flex gap-4 items-center">
                    <label className="font-semibold tracking-wider">
                      LACTATING (0-24 MONTHS)
                    </label>

                    {/* Yes Option */}
                    <label className="flex items-center gap-2 cursor-pointer text-lg">
                      <input
                        type="radio"
                        name="lactatingstatus"
                        value="yes"
                        checked={selectedUser.Lactating === "yes"}
                        onChange={() =>
                          setSelectedUser((prev: any) => ({
                            ...prev,
                            Lactating: "yes",
                            LactatingMonths: prev.LactatingMonths || "", // Keep months if switching
                          }))
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                      Yes
                    </label>

                    {/* No Option */}
                    <label className="flex items-center gap-2 cursor-pointer text-lg">
                      <input
                        type="radio"
                        name="lactatingstatus"
                        value="no"
                        checked={selectedUser.Lactating === "no"}
                        onChange={() =>
                          setSelectedUser((prev: any) => ({
                            ...prev,
                            Lactating: "no",
                            LactatingMonths: "", // Clear months if selecting "No"
                          }))
                        }
                        className="w-6 h-6 cursor-pointer"
                      />
                      No
                    </label>
                  </div>
                </div>
              </>
              {selectedUser.Age <= 5 && (
                <>
                  <div className="flex flex-col gap-0.5  w-full">
                    <label className="font-light  tracking-wider italic text-[1rem]">
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
                              Immunization: {
                                ...prev.Immunization,
                                BCG: value,
                              },
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
                                Immunization: {
                                  ...prev.Immunization,
                                  DPT: value,
                                },
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
                                Immunization: {
                                  ...prev.Immunization,
                                  Polio: value,
                                },
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
                    <label className="font-light  tracking-wider italic text-[1rem]">
                      WEIGHT(KG)
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
                    <label className="font-light  tracking-wider italic text-[1rem]">
                      HEIGHT(FT)
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
          </>
        )}
      </div>
    </div>
  );
};

export default MemberModalFamilyProfile;
