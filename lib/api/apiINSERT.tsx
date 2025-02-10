"use server";

import { supabaseAdmin, createSupbaseServerClient } from "../supabase";
import { v4 as uuidv4 } from "uuid";

const apiINSERT = async (formData: any, agentName: string, agentId: string) => {
  try {
    const locationID = uuidv4();
    const houseProfileStatus = await HouseProfileINSERT(
      formData,
      locationID,
      agentName,
      agentId
    );
    const memberStatus = await MemberINSERT(formData, formData.HouseProfileId);
    const locationStatus = await LocationINSERT(formData, locationID);
    const petStatus = await PetINSERT(formData);
    const apartmentStatus = await ApartmentINSERT(formData);
    const logStatus = await LogInsert(
      agentId,
      agentName,
      "Insert Census Data",
      `Insert census data id number ${formData.HouseProfileId}`,
      formData.HouseProfileId
    );

    if (
      houseProfileStatus &&
      memberStatus &&
      locationStatus &&
      petStatus &&
      apartmentStatus &&
      logStatus
    ) {
      console.log("Successfully Uploaded!");
      return true;
    } else {
      console.warn("Upload failed for one or more sections.");
      return false;
    }
  } catch (error) {
    console.error("Something went wrong.", error);
    return false;
  }
};

export default apiINSERT;

const HouseProfileINSERT = async (
  formData: any,
  locationID: string,
  agentName: string,
  agentId: string
) => {
  const {
    ContactNumber,
    HouseNumber,
    HouseProfileId,
    Note,
    DoYouHave,
    HouseHoldUses,
    Vehicle,
    Devices,
    Appliances,
    FamClass,
    RespondentName,
    RespondentSignature,
    TotalHouseHoldIncome,
    NumberOfFamily,
    RespondentNumber,
    BcNumber,
  } = formData;

  const NoMember = formData.FamMember.length;

  const { error } = await supabaseAdmin
    .from("HouseProfile")
    .insert([
      {
        HouseNumber: HouseNumber,
        BcNumber: BcNumber,
        ContactNumber: ContactNumber,
        HouseProfileId: HouseProfileId,
        LocationId: locationID,
        NumberofMembers: NoMember,
        NumberOfFamily: NumberOfFamily,
        AgentName: agentName,
        AgentId: agentId,
        RespondentName: RespondentName,
        RespondentSignature: RespondentSignature,
        RespondentNumber: RespondentNumber,
        DoYouHave: DoYouHave,
        HouseHoldUses: HouseHoldUses,
        Vehicle: Vehicle,
        Devices: Devices,
        Appliances: Appliances,
        FamClass: FamClass,
        TotalHouseHoldIncome: TotalHouseHoldIncome,
        Note: Note,
      },
    ])
    .select();

  if (error) {
    console.error("Error in HouseProfileINSERT:", error.message);
    return false;
  }

  return true;
};

export const MemberINSERT = async (data: any, HouseProfileId: any) => {
  const { FamMember } = data;
  let successfulInserts = 0;

  const Insert = async (member: any): Promise<boolean> => {
    try {
      // Validate required fields
      if (!member.MemberId || !member.FirstName || !member.LastName) {
        throw new Error(
          `Missing required fields for member: ${JSON.stringify(member)}`
        );
      }

      // Perform the insertion
      const { error } = await supabaseAdmin.from("FamMember").insert([
        {
          MemberId: member.MemberId,
          LastName: member.LastName,
          FirstName: member.FirstName,
          MiddleName: member.MiddleName,
          Suffix: member.Suffix,
          FamilyRelationship: member.FamilyRelationship,
          Birthday: member.Birthday,
          Age: member.Age,
          Gender: member.Gender,
          Occupation: member.Occupation,
          Education: member.Education,
          Religion: member.Religion,
          Sector: member.Sector,
          Lactating: member.Lactating,
          LactatingMonths: member.LactatingMonths,
          CivilStatus: member.CivilStatus,
          Disability: member.Disability,
          Immunization: member.Immunization,
          Weight: member.Weight,
          Height: member.Height,
          HouseProfileId: HouseProfileId,
        },
      ]);

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error(`Failed to insert member ${member.MemberId}:`, error);
      return false;
    }
  };

  // Loop through all members in the FamMember array
  for (const member of FamMember) {
    const isInserted = await Insert(member);
    if (isInserted) successfulInserts++;
  }

  // Return true if all members were successfully inserted
  return successfulInserts === FamMember.length;
};

const LocationINSERT = async (data: any, locationID: string) => {
  const { Location, HouseProfileId } = data;

  const { error } = await supabaseAdmin
    .from("Location")
    .insert([
      {
        Street: Location.Street,
        Block: Location.Block,
        Lot: Location.Lot,
        Phase: Location.Phase,
        Kilometer: Location.Kilometer,
        SubdivisionName: Location.SubdivisionName,
        HouseProfileId: HouseProfileId,
      },
    ])
    .select();

  if (error) {
    console.error("Error in LocationINSERT:", error.message);
    return false;
  }

  return true;
};

const PetINSERT = async (data: any) => {
  const { error } = await supabaseAdmin
    .from("Pet")
    .insert([
      {
        TypeofPet: data.Pet.TypeofPet,
        NumberofPet: data.Pet.NumberofPet,
        HouseProfileId: data.HouseProfileId,
        Remarks: data.Remarks,
      },
    ])
    .select();

  if (error) {
    console.error("Error in PetINSERT:", error.message);
    return false;
  }

  return true;
};

const ApartmentINSERT = async (data: any) => {
  const { error } = await supabaseAdmin
    .from("Apartment")
    .insert([
      {
        DoorNo: data.Apartment.DoorNo,
        FloorNo: data.Apartment.FloorNo,
        APTOwner: data.Apartment.APTOwner,
        HouseType: data.Apartment.HouseType,
        HouseToilet: data.Apartment.HouseToilet,
        WaterSource: data.Apartment.WaterSource,
        HouseProfileId: data.HouseProfileId,
      },
    ])
    .select();

  if (error) {
    console.error("Error in ApartmentINSERT:", error.message);
    return false;
  }

  return true;
};

export const LogInsert = async (
  agent_id: string,
  agent_name: string,
  action: string,
  description: string,
  data_id: string
) => {
  try {
    const supabase = await supabaseAdmin;

    const { data, error } = await supabase
      .from("Log")
      .insert([
        {
          agent_id: agent_id,
          agent_name: agent_name,
          action: action,
          description: description,
          data_id: data_id,
        },
      ])
      .select();

    if (error) {
      console.log("Error Message:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};
