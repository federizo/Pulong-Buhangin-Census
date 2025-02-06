"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaBuilding } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

const CensusApartmentForm = ({ formData, setFormData, edit, setEdit }: { formData: any, setFormData: React.Dispatch<React.SetStateAction<any>>, edit: boolean, setEdit: React.Dispatch<React.SetStateAction<any>> }) => {

    const [apartment, setApartment] = useState<boolean>(formData.Apartment.APTOwner === null || "EMPTY" || undefined ? false : true)



    const apartmentHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;


        setFormData((prev: any) => ({
            ...prev,
            Apartment: {
                ...prev.Apartment,
                [name]: value.toString().toUpperCase(),
            },
        }));
    };

    return (
        <div className="grid gap-3 w-full">
            <div className="flex gap-2 items-center">
                <h1 className="text-[1.2rem] font-semibold flex items-center gap-2">
                    <FaBuilding />
                    APARTMENT
                </h1>
                <Checkbox
                    disabled={edit}
                    className="h-6 w-6 border-2 rounded border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-700 transition-colors duration-300"
                    name="ApartmentStatus"
                    checked={apartment}
                    onCheckedChange={(value: boolean) => setApartment(value)}
                />
            </div>
            {apartment && <>
                <div className="flex flex-col gap-2">
  <label className="font-semibold tracking-wider">DOOR NO.</label>
  <input
    disabled={edit}
    required
    type="text"
    inputMode="numeric"  // ✅ Mobile-friendly numeric keypad
    maxLength={2}         // ✅ Limit input to 2 characters
    name="DoorNo"
    value={formData.Apartment.DoorNo}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d{0,2}$/.test(value)) { // ✅ Allow only up to 2 digits
        apartmentHandleChange(e);
      }
    }}
    className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded"
  />
</div>

<div className="flex flex-col gap-2">
  <label className="font-semibold tracking-wider">FLOOR NO.</label>
  <input
    disabled={edit}
    required
    type="text"
    inputMode="numeric"  // ✅ Mobile-friendly numeric keypad
    maxLength={2}         // ✅ Limit input to 2 characters
    name="FloorNo"
    value={formData.Apartment.FloorNo}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d{0,2}$/.test(value)) { // ✅ Allow only up to 2 digits
        apartmentHandleChange(e);
      }
    }}
    className="border-[0.5px] bg-transparent p-2 h-fit w-[100px] rounded"
  />
</div>

<div className="flex flex-col gap-2">
  <label className="font-semibold tracking-wider">NAME OF OWNER</label>
  <input
    disabled={edit}
    required
    type="text"
    name="APTOwner"
    value={formData.Apartment.APTOwner}
    onChange={(e) => {
      const value = e.target.value.toUpperCase(); // ✅ Convert to uppercase
      if (/^[A-Z\s]*$/.test(value)) {             // ✅ Allow only letters and spaces
        apartmentHandleChange(e);
      }
    }}
    className="border-[0.5px] bg-transparent p-2 rounded w-full max-w-2xl"
  />
</div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold tracking-wider">HOUSE TYPE</label>
                    <Select
                        disabled={edit}
                        name="HouseType"
                        value={formData.Apartment.HouseType}
                        onValueChange={(value) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                Apartment: { ...prev.Apartment, HouseType: value },
                            }))
                        }
                    >
                        <SelectTrigger className="w-[180px] rounded">
                            <SelectValue placeholder="Choose House Type" />
                        </SelectTrigger>
                        <SelectContent className="  rounded">
                            <SelectItem value="concrete">CONCRETE</SelectItem>
                            <SelectItem value="kahoy">KAHOY</SelectItem>
                            <SelectItem value="savage">SAVAGE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold tracking-wider">
                        HOUSEHOLD TOILETS WITH
                    </label>
                    <Select
                        disabled={edit}
                        name="HouseToilet"
                        value={formData.Apartment.HouseToilet}
                        onValueChange={(value) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                Apartment: { ...prev.Apartment, HouseToilet: value },
                            }))
                        }
                    >
                        <SelectTrigger className="w-[180px]  rounded">
                            <SelectValue placeholder="Choose House Type" />
                        </SelectTrigger>
                        <SelectContent className="  rounded">
                            <SelectItem value="watersealed">Water Sealed</SelectItem>
                            <SelectItem value="openpit">Open Pit</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold tracking-wider">
                        HOUSEHOLD SOURCE OF WATER
                    </label>
                    <Select
                        disabled={edit}
                        name="WaterSource"
                        value={formData.Apartment.WaterSource}
                        onValueChange={(value) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                Apartment: { ...prev.Apartment, WaterSource: value },
                            }))
                        }
                    >
                        <SelectTrigger className="w-[180px] rounded">
                            <SelectValue placeholder="Choose House Type" />
                        </SelectTrigger>
                        <SelectContent className=" rounded">
                            <SelectItem value="pipe">PIPE/NAWASA</SelectItem>
                            <SelectItem value="well">WELL/DEEP WELL</SelectItem>
                            <SelectItem value="spring">SPRING</SelectItem>
                            <SelectItem value="artesian">ARTESIAN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </>}

        </div>
    );
};

export default CensusApartmentForm