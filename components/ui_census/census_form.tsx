import React, { useEffect, useState } from "react";
import moment from "moment";
import { IoLocationSharp, IoPeopleSharp, IoPerson } from "react-icons/io5";
import { MdYard, MdOutlinePets } from "react-icons/md";
import CensusMemberForm from "./census_member_form";
import CensusApartment from "./census_apartment_form";
import { FaCarRear } from "react-icons/fa6";
import { Checkbox } from "@/components/ui/checkbox";
import { MdOutlineDevices } from "react-icons/md";
import { PiTelevisionSimpleLight } from "react-icons/pi";
import { MdFamilyRestroom } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LuAsterisk } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

const CensusForm = ({
  formData,
  setFormData,
  edit,
  setEdit,
  memberForm,
  setMemberForm,
  setSelectedUser,
}: {
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  memberForm: any;
  setMemberForm: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [minimizeForm, setMinimizeForm] = useState<boolean>(false);

  const saveMemberFormData = () => {
    const {
      FirstName,
      LastName,
      FamilyRelationship,
      Birthday,
      Gender,
      Occupation,
      Education,
      CivilStatus,
      Weight,
      Height,
      Age,
    } = memberForm;

    if (Age <= 5 && (Weight.trim() === "" || Height.trim() === "")) {
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

    const check =
      FirstName.trim() !== "" &&
      LastName.trim() !== "" &&
      FamilyRelationship.trim() !== "" &&
      Birthday.trim() !== "" &&
      Gender.trim() !== "" &&
      Education.trim() !== "" &&
      CivilStatus.trim() !== "";

    if (!check) {
      alert("Fill  data");
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        FamMember: [...prevState.FamMember, memberForm], // Add the new member to the members array
      }));
      setMemberForm({
        MemberId: "",
        FirstName: "",
        LastName: "",
        MiddleName: "",
        Suffix: "",
        FamilyRelationship: "",
        Birthday: "",
        Age: 0,
        Gender: "",
        CivilStatus: "",
        Occupation: { value: "", other: "", position: "" },
        Education: { elem: false, hs: false, college: false, other: false },
        Religion: { value: "", other: "" },
        Sector: { src: false, sp: false, fourps: false },
        Lactating: false,
        LactatingMonths: "",
        Immunization: "",
        Disability: "",
        Weight: "",
        Height: "",
      });
    }
    setMinimizeForm(!minimizeForm);
    scrollToDiv();
  };

  const handleShowMemberInformation = (member: any) => {
    setSelectedUser(member);
  };

  function scrollToDiv(): void {
    const targetDiv = document.getElementById("targetDiv");

    if (targetDiv) {
      targetDiv.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  const handleIncome = (e: any) => {
    let income = e.target.value.replace(/[^0-9]/g, "");

    const famClass =
      income <= 21194 ? "low" : income <= 131484 ? "mid" : "high";
    // Update the form data state
    setFormData((prev: any) => ({
      ...prev,
      TotalHouseHoldIncome: income, // Store the income value
      FamClass: famClass, // Store the classification
    }));
  };

  return (
    <>
      <div className="flex flex-col gap-2 px-2  ">
        <label>Census ID: {formData.HouseProfileId}</label>
        {formData.AgentId !== "" && <label>By: {formData.AgentId}</label>}
        <label>Date: {moment(formData.created_at).format("LL")}</label>

        <div className="mt-5 flex flex-col gap-3 text-[1.6vh] text-black dark:text-white">
          <div className="flex w-full gap-2 items-center">
            <label className="font-semibold tracking-wider flex">
              FAMILY MEMBERS NO:
            </label>
            <label className="  h-fit w-fit rounded">
              {formData.FamMember.length}
            </label>
          </div>

          <div className="flex flex-col w-full gap-2 ">
            <label className="font-semibold tracking-wider flex ">
              NO OF FAMILY:{" "}
              <LuAsterisk className="text-red-500 text-[0.8rem]" />
            </label>
            <input
              value={formData.NumberOfFamily}
              type="text"
              disabled={edit}
              name="NumberOfFamily"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 2) {
                  setFormData((prev: any) => ({
                    ...prev,
                    NumberOfFamily: value, // Update only the numeric value
                  }));
                }
              }}
              className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded "
            />
          </div>

          <div className="flex w-full flex-col gap-2  ">
            <label className="font-semibold tracking-wider flex gap-1">
              HOUSE CONTACT NO:{" "}
              <LuAsterisk className="text-red-500 text-[0.8rem]" />
            </label>
            <input
              value={formData.ContactNumber}
              type="text"
              disabled={edit}
              name="ContactNumber"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 11) {
                  setFormData((prev: any) => ({
                    ...prev,
                    ContactNumber: value, // Update only the numeric value
                  }));
                }
              }} // Remove non-numeric characters
              className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
            />
          </div>
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <h1 className="font-semibold items-center gap-2 flex text-[1.2rem]">
            <IoLocationSharp /> LOCATION
          </h1>
          <div className="flex w-full flex-col gap-2  ">
            <label className="font-semibold tracking-wider flex gap-1">
              HOUSE NO: <LuAsterisk className="text-red-500 text-[0.8rem]" />{" "}
              <span className="italic text-slate-500">
                {"(Type NA if not applicable)"}
              </span>
            </label>
            <input
              value={formData.HouseNumber}
              type="text"
              disabled={edit}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 5) {
                  setFormData((prev: any) => ({
                    ...prev,
                    HouseNumber: value,
                  }));
                }
              }}
              name="HouseNumber"
              className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
            />
          </div>

          <div className="flex w-full flex-col gap-2  ">
            <label className="font-semibold tracking-wider flex gap-1">
              BC NO:
            </label>
            <input
              value={formData.BcNumber}
              type="text"
              disabled={edit}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 4) {
                  setFormData((prev: any) => ({
                    ...prev,
                    BcNumber: value,
                  }));
                }
              }}
              name="BcNumber"
              className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label className="font-semibold tracking-wider">STREET:</label>
            <input
              value={formData.Location.Street}
              type="text"
              disabled={edit}
              onChange={(e) => {
                const input = e.target.value.toUpperCase();
                if (/^[A-Z\s]*$/.test(input)) {
                  // Allow only uppercase letters and spaces
                  setFormData((prev: any) => ({
                    ...prev,
                    Location: {
                      ...prev.Location,
                      Street: input,
                    },
                  }));
                }
              }}
              name="housenumber"
              className="border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
            />
          </div>
          <div className="flex w-full flex-col gap-2  ">
            <label className="font-semibold tracking-wider">SUBD:</label>
            <input
              value={formData.Location?.SubdivisionName}
              type="text"
              disabled={edit}
              onChange={(e) => {
                const input = e.target.value.toUpperCase();
                if (/^[A-Z\s]*$/.test(input)) {
                  setFormData((prev: any) => ({
                    ...prev,
                    Location: {
                      ...prev.Location, // Preserve other properties of the first Location object
                      SubdivisionName: e.target.value.toUpperCase(), // Update only the Street property
                    },
                  }));
                }
              }}
              name="housenumber"
              className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <label className="font-semibold tracking-wider flex gap-1">
              KM: <LuAsterisk className="text-red-500 text-[0.8rem]" />{" "}
              <span className="italic text-slate-500">
                {"(Choose OTHER if not applicable)"}
              </span>
            </label>
            <Select
              disabled={edit}
              name="Kilometer"
              value={formData.Location.Kilometer}
              onValueChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  Location: {
                    ...prev.Location, // Preserve other properties of Location
                    Kilometer: e, // Update only the Kilometer property
                  },
                }))
              }
            >
              <SelectTrigger className="w-full py-2 rounded">
                <SelectValue placeholder="Choose Kilometer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="37">37</SelectItem>
                <SelectItem value="38-A">38-A</SelectItem>
                <SelectItem value="38-B">38-B</SelectItem>
                <SelectItem value="38-POBLACION">38-Poblacion</SelectItem>
                <SelectItem value="39">39</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="41">41</SelectItem>
                <SelectItem value="42">42</SelectItem>
                {/* <SelectItem value="OTHER">OTHER</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {formData.Location[0]?.SubdivisionName !== "" && (
            <>
              <div className="flex w-full flex-col gap-2  ">
                <label className="font-semibold tracking-wider">BLOCK:</label>
                <input
                  value={formData?.Location.Block}
                  type="text"
                  disabled={edit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 3) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Location: {
                          ...prev.Location, // Preserve other properties of the first Location object
                          Block: value, // Update only the Street property
                        },
                      }));
                    }
                  }}
                  name="housenumber"
                  className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
                />
              </div>

              <div className="flex w-full flex-col gap-2  ">
                <label className="font-semibold tracking-wider">LOT:</label>
                <input
                  value={formData?.Location?.Lot}
                  type="text"
                  disabled={edit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 3) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Location: {
                          ...prev.Location, // Preserve other properties of the first Location object
                          Lot: value, // Update only the Street property
                        },
                      }));
                    }
                  }}
                  name="housenumber"
                  className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
                />
              </div>

              <div className="flex w-full flex-col gap-2  ">
                <label className="font-semibold tracking-wider">PHASE:</label>
                <input
                  value={formData?.Location?.Phase}
                  type="text"
                  disabled={edit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Location: {
                          ...prev.Location, // Preserve other properties of the first Location object
                          Phase: value, // Update only the Street property
                        },
                      }));
                    }
                  }}
                  name="housenumber"
                  className=" border-[0.5px] bg-transparent p-2 h-fit w-full rounded"
                />
              </div>
            </>
          )}
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <h1
            id="targetDiv"
            onClick={() => console.log(formData)}
            className="font-semibold flex items-center gap-2 text-[1.2rem] mt-5"
          >
            <IoPeopleSharp />
            FAMILY MEMBER {formData.FamMember.length}
          </h1>
          <div className="flex flex-wrap gap-2 border-[1px] p-2 rounded items-center mb-3">
            <label className="tracking-widest">MEMBERS:</label>
            {formData?.FamMember?.map((member: any, index: number) => (
              <div
                onClick={() => handleShowMemberInformation(member)}
                key={member.MemberId}
                className="px-2 py-1 bg-slate-300 w-fit text-black rounded flex flex-col gap-2 items-center cursor-pointer hover:bg-green-500 duration-300 hover:"
              >
                <div className="flex items-center gap-1">
                  <IoPerson /> {member.FirstName} {member.LastName}{" "}
                  {member.Suffix}
                </div>
              </div>
            ))}
          </div>

          {!edit && (
            <div>
              <CensusMemberForm
                formData={formData}
                setFormData={setFormData}
                memberForm={memberForm}
                setMemberForm={setMemberForm}
                minimizeForm={minimizeForm}
                setMinimizeForm={setMinimizeForm}
              />

              {minimizeForm && (
                <div className="flex w-full flex-col items-center justify-center mt-2 mb-15">
                  <button
                    onClick={() => saveMemberFormData()}
                    type="button"
                    className="text-center h-[30px] bg-slate-100 text-black px-2 font-semibold rounded hover:bg-green-800 duration-300 hover:"
                  >
                    ADD MEMBER
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <div className="mt-5">
            <CensusApartment
              formData={formData}
              setFormData={setFormData}
              setEdit={setEdit}
              edit={edit}
            />
          </div>
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <div className="flex flex-col mt-5 gap-5">
            <label className="text-[1.2rem] font-semibold tracking-wider flex items-center gap-2">
              <MdYard className="text-[1.3rem]" />
              DO YOU HAVE:
            </label>
            <div className="flex gap-2">
              <label className="font-semibold tracking-wider">
                VEGTABLE/GARDEN
              </label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="Garden"
                checked={formData.DoYouHave?.Garden}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    DoYouHave: { ...prev.DoYouHave, Garden: value },
                  }))
                }
              />
            </div>
            <div className="flex gap-2 ">
              <label className="font-semibold tracking-wider">
                LIVESTOCK/POULTRY
              </label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="LiveStock"
                checked={formData.DoYouHave?.LiveStock}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    DoYouHave: { ...prev.DoYouHave, LiveStock: value },
                  }))
                }
              />
            </div>
            <div className="flex gap-2 ">
              <label className="font-semibold tracking-wider">PIGGERY</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="Piggery"
                checked={formData.DoYouHave?.Piggery}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    DoYouHave: { ...prev.DoYouHave, Piggery: value },
                  }))
                }
              />
            </div>
            <div className="flex gap-2 ">
              <label className="font-semibold tracking-wider">FISHPOND</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="Fishpond"
                checked={formData.DoYouHave?.Fishpond}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    DoYouHave: { ...prev.DoYouHave, Fishpond: value },
                  }))
                }
              />
            </div>
          </div>
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <div className="flex flex-col mt-5 gap-5">
            <label className="text-[1.2rem] font-semibold tracking-wider flex items-center gap-2">
              <MdYard className="text-[1.3rem]" />
              HOUSEHOLD USES:
            </label>
            <div className="flex gap-2">
              <label className="font-semibold tracking-wider">
                IODIZED SALT
              </label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="Iodized"
                checked={formData.HouseHoldUses?.Iodized}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    HouseHoldUses: { ...prev.HouseHoldUses, Iodized: value },
                  }))
                }
              />
            </div>

            <div className="flex gap-2 ">
              <label className="font-semibold tracking-wider">
                FORTIFIED FOOD PRODUCTS
              </label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="Fortified"
                checked={formData.HouseHoldUses?.Fortified}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    HouseHoldUses: { ...prev.HouseHoldUses, Fortified: value },
                  }))
                }
              />
            </div>
          </div>
          <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

          <div className="flex flex-col gap-3 mt-2">
            <label className="text-[1.2rem] font-semibold flex items-center gap-2 ">
              <MdOutlinePets />
              DO YOU HAVE PETS:
            </label>

            <div className="flex gap-2 items-center ">
              <label className="font-semibold tracking-wider">DOG</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="dog"
                checked={formData.Pet?.TypeofPet?.dog}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    Pet: {
                      ...prev.Pet,
                      TypeofPet: { ...prev.Pet.TypeofPet, dog: value },
                    },
                  }))
                }
              />
              <input
                disabled={edit || !formData.Pet?.TypeofPet?.dog} // Disable if edit mode OR checkbox is unchecked
                value={formData.Pet?.NumberofPet?.dogno}
                type="text"
                name="NumberofPet"
                onChange={(e) => {
                  const isDogChecked = formData.Pet?.TypeofPet?.dog;
                  let value = e.target.value;

                  if (isDogChecked) {
                    // ✅ Allow ONLY numbers when checkbox is checked
                    value = value.replace(/[^1-9]/g, "");
                  }

                  // Limit to 2 characters max
                  if (value.length <= 2) {
                    setFormData((prev: any) => ({
                      ...prev,
                      Pet: {
                        ...prev.Pet,
                        NumberofPet: {
                          ...prev.Pet.NumberofPet,
                          dogno: value,
                        },
                      },
                    }));
                  }
                }}
                className={`border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded no-arrows ${
                  !formData.Pet?.TypeofPet?.dog
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`} // Visual cue when disabled
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="font-semibold tracking-wider">CAT</label>
              <Checkbox
                disabled={edit}
                className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                name="cat"
                checked={formData.Pet?.TypeofPet?.cat}
                onCheckedChange={(value: boolean) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    Pet: {
                      ...prev.Pet,
                      TypeofPet: { ...prev.Pet.TypeofPet, cat: value },
                    },
                  }))
                }
              />
              <input
                disabled={edit || !formData.Pet?.TypeofPet?.cat} // Disable when unchecked
                value={formData.Pet?.NumberofPet?.catno}
                type="text"
                name="NumberofPet"
                onChange={(e) => {
                  const isCatChecked = formData.Pet?.TypeofPet?.cat;
                  let value = e.target.value;

                  if (isCatChecked) {
                    // ✅ Allow ONLY numbers when checkbox is checked
                    value = value.replace(/[^1-9]/g, "");
                  }

                  // Limit to 2 characters max
                  if (value.length <= 2) {
                    setFormData((prev: any) => ({
                      ...prev,
                      Pet: {
                        ...prev.Pet,
                        NumberofPet: {
                          ...prev.Pet.NumberofPet,
                          catno: value,
                        },
                      },
                    }));
                  }
                }}
                className={`border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded no-arrows ${
                  !formData.Pet?.TypeofPet?.cat
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`} // Visual cue when disabled
              />
            </div>
            <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

            <div className="flex flex-col gap-3 mt-4">
              <label className="text-[1.2rem] font-semibold flex items-center gap-2 ">
                <FaCarRear /> VEHICLE
              </label>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    4 WHEEL VEHICLE
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Car, Van, Truck)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Vehicle?.fourwheel}
                  type="text"
                  name="fourwheel"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', '30', etc., when it's two digits
                    if (value.length === 2 && value[0] === "0") return; // Prevent '01', '02', etc.

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Vehicle: { ...prev.Vehicle, fourwheel: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    3 WHEEL VEHICLE
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Tricycle)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Vehicle?.treewheel}
                  type="text"
                  name="treewheel"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', '30', etc., when it's two digits
                    if (value.length === 2 && value[0] === "0") return; // Prevent '01', '02', etc.

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Vehicle: { ...prev.Vehicle, treewheel: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    2 WHEEL VEHICLE
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Motorcycle)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Vehicle?.twowheel}
                  type="text"
                  name="twowheel"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', '30', etc., when it's two digits
                    if (value.length === 2 && value[0] === "0") return; // Prevent '01', '02', etc.

                    // 4️⃣ Limit input to 2 digits
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Vehicle: { ...prev.Vehicle, twowheel: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

            <div className="flex flex-col gap-3 mt-4">
              <label className="text-[1.2rem] font-semibold flex items-center gap-2 ">
                <MdOutlineDevices /> DEVICES
              </label>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    SMART PHONE
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Cellphone, Tablet)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Devices?.smartphone}
                  type="text"
                  name="smartphone"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Devices: { ...prev.Devices, smartphone: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    COMPUTER
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Desktop, Laptop)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Devices?.computer}
                  type="text"
                  name="computer"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Devices: { ...prev.Devices, computer: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    WIFI
                  </label>
                  <span className="italic text-xs text-slate-500 tracking-widest">
                    {"(Desktop, Laptop)"}
                  </span>
                </div>
                <input
                  disabled={edit}
                  value={formData.Devices?.wifi}
                  type="text"
                  name="wifi"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Devices: { ...prev.Devices, wifi: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

            <div className="flex flex-col gap-3 mt-4">
              <label className="text-[1.2rem] font-semibold flex items-center gap-2 ">
                <PiTelevisionSimpleLight /> APPLIANCES
              </label>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    AIRCON
                  </label>
                </div>
                <input
                  disabled={edit}
                  value={formData.Appliances?.aircon}
                  type="text"
                  name="aircon"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Appliances: { ...prev.Appliances, aircon: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    REFRIGERATOR
                  </label>
                </div>
                <input
                  disabled={edit}
                  value={formData.Appliances?.refigerator}
                  type="text"
                  name="refigerator"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Appliances: { ...prev.Appliances, refigerator: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    TELEVISION
                  </label>
                </div>
                <input
                  disabled={edit}
                  value={formData.Appliances?.television}
                  type="text"
                  name="television"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Appliances: { ...prev.Appliances, television: value },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    WASHING MACHINE/DRYER
                  </label>
                </div>
                <input
                  disabled={edit}
                  value={formData.Appliances?.washingmachine}
                  type="text"
                  name="washingmachine"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Allow only digits
                    value = value.replace(/[^0-9]/g, "");

                    // 2️⃣ Disallow '0' as the first or only digit
                    if (value === "0") return;

                    // 3️⃣ Allow '10', '20', etc., but prevent '01', '02', etc.
                    if (value.length === 2 && value[0] === "0") return;

                    // 4️⃣ Limit input to 2 digits max
                    if (value.length <= 2) {
                      setFormData((prev: any) => ({
                        ...prev,
                        Appliances: {
                          ...prev.Appliances,
                          washingmachine: value,
                        },
                      }));
                    }
                  }}
                  className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex flex-col w-full items-start gap-2">
                <div className="flex items-center flex-col">
                  <label className="text-md lg:text-lg tracking-widest">
                    OTHER APPLIANCES
                  </label>
                </div>
                <textarea
                  disabled={edit}
                  value={formData.Appliances?.other}
                  name="other"
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      Appliances: {
                        ...prev.Appliances,
                        other: e.target.value.toUpperCase(),
                      },
                    }))
                  }
                  className="w-full rounded-md p-2 bg-transparent border-[1px]"
                />
              </div>
            </div>
            <div className="w-[100%] h-[1px] mt-5 bg-slate-800" />

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">
                TOTAL HOUSEHOLD INCOME MONTHLY{" "}
                <span className="italic font-normal text-slate-500 tracking-widest">
                  {"(PHP)"}
                </span>
              </label>
              <input
                disabled={edit}
                value={formData.TotalHouseHoldIncome}
                type="text"
                name="TotalHouseHoldIncome"
                className="bg-transparent p-2 border-[1px] rounded-md"
                onChange={(e) => {
                  let value = e.target.value;

                  // 1️⃣ Allow only numeric characters
                  value = value.replace(/[^0-9]/g, "");

                  // 2️⃣ Limit input to 7 digits
                  if (value.length <= 7) {
                    handleIncome({ target: { value } }); // Ensure proper event handling
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-3 mt-4 w-auto">
              <label className="text-[1.2rem] font-semibold flex items-center gap-2 ">
                <MdFamilyRestroom /> FAMILY CLASS
              </label>
              <RadioGroup
                disabled
                value={formData.FamClass}
                className="flex flex-wrap gap-5"
              >
                <div className="flex items-center space-x-2 text-md lg:text-lg">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">LOW CLASS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid" id="mid" />
                  <Label htmlFor="mid">MIDDLE CLASS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">HIGH CLASS</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2 w-full mt-5 mb-5">
              <div className="flex justify-center w-full mb-5">
                <div className="w-[100%] h-[1px] bg-slate-800" />
              </div>

              <label className="text-lg tracking-widest">REMARKS:</label>
              <textarea
                disabled={edit}
                rows={6}
                value={formData.Note}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    Note: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full rounded-md p-2 bg-transparent border-[1px]"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CensusForm;
