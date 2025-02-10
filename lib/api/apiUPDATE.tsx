"use server";

import {
  checkApartment,
  checkFamMember,
  checkHouseProfile,
  checkLocation,
  checkPet,
} from "@/components/filter/checker";
import { createSupbaseServerClient } from "../supabase";
import { LogInsert } from "./apiINSERT";
import { getServerSideCookies } from "../util/cookies";

export const updateChecker = async (formData: any, prevformData: any) => {
  const responseHouseProfile = checkHouseProfile(formData, prevformData);
  const responseLocation = checkLocation(formData, prevformData);
  const responseFamMember = checkFamMember(formData, prevformData);
  const responseApartment = checkApartment(formData, prevformData);
  const responsePet = checkPet(formData, prevformData);

  if (responseHouseProfile || responseFamMember)
    await updateHouseProfile(formData);
  if (responseLocation) await updateLocation(formData);
  if (responseFamMember) await updateFamMember(formData, prevformData);
  if (responseApartment) await updateApartment(formData);
  if (responsePet) await updatePet(formData);

  return true;
};

/** ✅ Updates HouseProfile */
const updateHouseProfile = async (data: any) => {
  const supabase = await createSupbaseServerClient();

  const { error } = await supabase
    .from("HouseProfile")
    .update({
      HouseNumber: data.HouseNumber,
      ContactNumber: data.ContactNumber,
      NumberofMembers: data.FamMember?.length || 0,
      NumberOfFamily: data.NumberOfFamily,
      AgentId: data.current,
      DoYouHave: data.DoYouHave,
      HouseHoldUses: data.HouseHoldUses,
      Devices: data.Devices,
      Vehicle: data.Vehicle,
      Appliances: data.Appliances,
      Note: data.Note,
      FamClass: data.FamClass,
      TotalHouseHoldIncome: data.TotalHouseHoldIncome,
    })
    .eq("HouseProfileId", data.HouseProfileId)
    .select();

  InsertLogForUpdate(
    "Update HouseProfile",
    `Updated HouseProfileId with ID number ${data.HouseProfileId}`,
    data
  );

  if (error) {
    console.error("updateHouseProfile Error:", error);
    return false;
  }
  return true;
};

/** ✅ Updates Family Members */
const updateFamMember = async (data: any, prevdata: any) => {
  if (!Array.isArray(data.FamMember)) {
    console.error("Error: data.FamMember is undefined or not an array");
    return false;
  }

  const safePrevFamMembers = Array.isArray(prevdata?.FamMember)
    ? prevdata.FamMember
    : [];

  // Find new members
  const newFamMembers = data.FamMember.filter(
    (newMember: any) =>
      !safePrevFamMembers.some(
        (oldMember: any) => oldMember.MemberId === newMember.MemberId
      )
  );

  // Find updated existing members
  const updateExistingFamMembers = data.FamMember.map((newMember: any) => {
    const oldMember = safePrevFamMembers.find(
      (old: any) => old.MemberId === newMember.MemberId
    );
    if (oldMember) {
      const changedFields: any = {};
      Object.keys(newMember).forEach((key) => {
        if (newMember[key] !== oldMember[key] && newMember[key] !== undefined) {
          changedFields[key] = newMember[key];
        }
      });

      if (Object.keys(changedFields).length > 0) {
        return { MemberId: newMember.MemberId, ...changedFields };
      }
    }
    return undefined;
  }).filter(Boolean); // Remove undefined entries

  // Find removed members
  const removedFamMembers = safePrevFamMembers.filter(
    (oldMember: any) =>
      !data.FamMember.some(
        (newMember: any) => newMember.MemberId === oldMember.MemberId
      )
  );

  // Insert new members
  if (newFamMembers.length > 0) await insertNewMember(newFamMembers, data);

  // Update existing members
  if (updateExistingFamMembers.length > 0) {
    await updateMember(updateExistingFamMembers, data);
    InsertLogForUpdate(
      "Update Member",
      `Updated member list for HouseProfileId ${data.HouseProfileId}`,
      data
    );
  }

  // Remove deleted members
  if (removedFamMembers.length > 0) await deleteMember(removedFamMembers, data);
};

/** ✅ Inserts New Members */
const insertNewMember = async (newFamMembers: any, data: any) => {
  const supabase = await createSupbaseServerClient();
  await supabase.from("FamMember").insert(newFamMembers);
};

/** ✅ Updates Existing Members */
const updateMember = async (updateExistingFamMembers: any, data: any) => {
  const supabase = await createSupbaseServerClient();
  for (const member of updateExistingFamMembers) {
    await supabase
      .from("FamMember")
      .update(member)
      .eq("MemberId", member.MemberId);
  }
};

/** ✅ Deletes Members */
const deleteMember = async (removedFamMembers: any, data: any) => {
  const supabase = await createSupbaseServerClient();
  for (const member of removedFamMembers) {
    await supabase.from("FamMember").delete().eq("MemberId", member.MemberId);
  }
};

/** ✅ Updates Apartment */
const updateApartment = async (data: any) => {
  const supabase = await createSupbaseServerClient();
  const { error } = await supabase
    .from("Apartment")
    .update(data.Apartment)
    .eq("HouseProfileId", data.HouseProfileId)
    .select();

  InsertLogForUpdate(
    "Update Apartment",
    `Updated HouseProfileId ${data.HouseProfileId}`,
    data
  );
  return !error;
};

/** ✅ Updates Location */
const updateLocation = async (data: any) => {
  const supabase = await createSupbaseServerClient();
  const { error } = await supabase
    .from("Location")
    .update(data.Location)
    .eq("HouseProfileId", data.HouseProfileId)
    .select();

  InsertLogForUpdate(
    "Update Location",
    `Updated Location of HouseProfileId ${data.HouseProfileId}`,
    data
  );
  return !error;
};

/** ✅ Updates Pets */
const updatePet = async (data: any) => {
  const supabase = await createSupbaseServerClient();
  const { error } = await supabase
    .from("Pet")
    .update(data.Pet)
    .eq("HouseProfileId", data.HouseProfileId)
    .select();

  InsertLogForUpdate(
    "Update Pet",
    `Updated Pet for HouseProfileId ${data.HouseProfileId}`,
    data
  );
  return !error;
};

/** ✅ Updates a Single Member */
export const updateSingleMember = async (item: any, prevItem: any) => {
  const supabase = await createSupbaseServerClient();

  const { error } = await supabase
    .from("FamMember")
    .update(item)
    .eq("MemberId", item.MemberId)
    .select(); // ✅ Fetch updated data after update

  InsertLogForUpdate(
    "Update Single Member",
    `Updated ${item.FirstName} ${item.LastName}`,
    item.HouseProfileId
  );

  if (error) {
    return { success: false, msg: error.message };
  }

  // ✅ Return the updated data so frontend can update state
  return { success: true, msg: "Successfully updated member", data: item };
};

/** ✅ Logs Updates */
export const InsertLogForUpdate = async (
  action: string,
  desc: string,
  data: any
) => {
  const supabase = await createSupbaseServerClient();
  await supabase.from("Logs").insert({
    action,
    description: desc,
    data_id: data.HouseProfileId,
    timestamp: new Date(),
  });
};
