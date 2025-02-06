import moment from "moment";
import React from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";

// Define interfaces for the nested data structure
interface Sector {
  sp: boolean;
  src: boolean;
  fourps: boolean;
}

interface Religion {
  other: string;
  value: string;
}

interface Education {
  hs: boolean;
  elem: boolean;
  other: boolean;
  college: boolean;
}

interface Occupation {
  other: string;
  value: string;
}

interface Location {
  id: string;
  Lot: string;
  Block: string;
  Phase: string;
  Street: string;
  Kilometer: string;
  created_at: string;
  HouseProfileId: string;
  SubdivisionName: string;
}

interface HouseProfile {
  location: Location;
  houseprofile: {
    HouseNumber: string;
    ContactNumber: string;
    HouseProfileId: string;
    NumberOfFamily: string;
    RespondentName: string | null;
    RespondentSignature: string | null;
    DoYouHave: Record<string, any>;
    HouseHoldUses: Record<string, any>;
    Vehicle: string | null;
    Devices: Record<string, any>;
    Appliances: Record<string, any>;
    FamClass: string | null;
    TotalHouseHoldIncome: string | null;
    Note: string;
  };
}

interface ExcelData {
  id: string;
  Age: string;
  Gender: string;
  Height: string;
  Sector: Sector;
  Suffix: string;
  Weight: string;
  Birthday: string;
  LastName: string;
  MemberId: string;
  Religion: Religion;
  Education: Education;
  FirstName: string;
  Lactating: string;
  Disability: string;
  MiddleName: string;
  Occupation: Occupation;
  created_at: string;
  CivilStatus: string;
  Immunization: Record<string, any>;
  HouseProfileId: string;
  LactatingMonths: string;
  FamilyRelationship: string;
  familyclass: string | null;
  kilometer: string;
  HouseProfile: HouseProfile;
}

// Flatten the nested data for Excel export
const flattenData = (data: ExcelData[]) => {
  return data.map((item, index) => ({
    id: index + 1,
    MemberId: item.MemberId.toUpperCase(),
    Created_at: moment(item.created_at).format("LL").toUpperCase(),
    FirstName: item.FirstName.toUpperCase(),
    MiddleName: item.MiddleName.toUpperCase(),
    LastName: item.LastName.toUpperCase(),
    Suffix: item.Suffix.toUpperCase(),
    Age: item.Age.toUpperCase(),
    Gender: item.Gender.toUpperCase(),
    Birthday: item.Birthday.toUpperCase(),
    CivilStatus: item.CivilStatus.toUpperCase(),
    FamilyRelationship: item.FamilyRelationship.toUpperCase(),

    Height: item.Height.toUpperCase(),
    Weight: item.Weight.toUpperCase(),

    Religion: item.Religion.value.toUpperCase(),
    Other_Religion: item.Religion.other.toUpperCase(),
    HighSchool: item.Education?.hs ? "YES" : "",
    Elementary: item.Education?.elem ? "YES" : "",
    College: item.Education?.college ? "YES" : "",
    Other_Education: item.Education?.other ? "YES" : "",

    SP: item.Sector.sp ? "YES" : "",
    SRc: item.Sector.src ? "YES" : "",
    Fourps: item.Sector.fourps ? "YES" : "",

    Lactating: item.Lactating ? "YES" : "",
    LactatingMonths: item.LactatingMonths.toUpperCase(),

    Disability: item.Disability === null ? "" : item.Disability.toUpperCase(),

    Occupation:
      item.Occupation.value === null ? "" : item.Occupation.value.toUpperCase(),

    Other_Occupation:
      item.Occupation.other === null ? "" : item.Occupation.other.toUpperCase(),

    Immunization: `BCG: ${
      item.Immunization?.BCG !== undefined ? item.Immunization?.BCG : 0
    }, DPT: ${
      item.Immunization?.DPT !== undefined ? item.Immunization?.DPT : 0
    }, Polio: ${
      item.Immunization?.Polio !== undefined ? item.Immunization?.Polio : 0
    }, Measles: ${
      item.Immunization?.Measles !== undefined ? item.Immunization?.Measles : 0
    }`.toUpperCase(),

    SubdivisionName:
      item.HouseProfile.location.SubdivisionName === null
        ? ""
        : item.HouseProfile.location.SubdivisionName.toUpperCase(),

    HouseNumber:
      item.HouseProfile.houseprofile.HouseNumber === null
        ? ""
        : item.HouseProfile.houseprofile.HouseNumber.toUpperCase(),

    ContactNumber:
      item.HouseProfile.houseprofile.ContactNumber === null
        ? ""
        : item.HouseProfile.houseprofile.ContactNumber.toUpperCase(),

    Lot:
      item.HouseProfile.location.Lot === null
        ? ""
        : item.HouseProfile.location.Lot.toUpperCase(),

    Block:
      item.HouseProfile.location.Block === null
        ? ""
        : item.HouseProfile.location.Block.toUpperCase(),

    Phase:
      item.HouseProfile.location.Phase === null
        ? ""
        : item.HouseProfile.location.Phase.toUpperCase(),

    Street:
      item.HouseProfile.location.Street === null
        ? ""
        : item.HouseProfile.location.Street.toUpperCase(),

    Kilometer:
      item.HouseProfile.location.Kilometer === null
        ? ""
        : item.HouseProfile.location.Kilometer.toUpperCase(),

    FamClass: item.familyclass === null ? "" : item.familyclass.toUpperCase(),
  }));
};

const EXCEL_LAYOUT: React.FC<{ item: ExcelData[] }> = ({ item }) => {
  const handleExportToExcel = () => {
    // Flatten the data before exporting
    const flattenedData = flattenData(item);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(flattenedData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "PBFamilyProfiles");

    // Write the workbook to a file
    XLSX.writeFile(wb, "PbCensus.xlsx");
  };

  return (
    <button
      onClick={handleExportToExcel}
      className="flex items-center gap-1 bg-green-600 px-4 py-1 border-[1px] border-zinc-800 rounded-md duration-300 hover:border-lime-600 hover:bg-green-700"
    >
      <RiFileExcel2Line /> EXCEL
    </button>
  );
};

export default EXCEL_LAYOUT;
