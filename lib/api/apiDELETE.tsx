"use server";

import { createSupbaseServerClient } from "../supabase";
import { InsertLogForUpdate } from "./apiUPDATE";

export const HouseProfileDELETE = async (
  houseProfileId: number
): Promise<{ success: boolean; message?: string }> => {
  const supabase = await createSupbaseServerClient();

  try {
    // Parallel deletion of related records
    await Promise.all([
      supabase.from("FamMember").delete().eq("HouseProfileId", houseProfileId),
      supabase.from("Location").delete().eq("HouseProfileId", houseProfileId),
      supabase.from("Pet").delete().eq("HouseProfileId", houseProfileId),
      supabase.from("Apartment").delete().eq("HouseProfileId", houseProfileId),
    ]);

    // Delete the parent record
    const { error: houseProfileError } = await supabase
      .from("HouseProfile")
      .delete()
      .eq("HouseProfileId", houseProfileId);

    if (houseProfileError) {
      console.error("Error deleting HouseProfile:", houseProfileError.message);
      return { success: false, message: houseProfileError.message };
    }

    InsertLogForUpdate(
      "Delete HouseProfile",
      `Deleted HouseProfile with ID number of ${houseProfileId}`,
      houseProfileId
    );
    return { success: true };
  } catch (error) {
    console.error("An error occurred during deletion:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const FamMemberDELETE = async (
  famID: number,
  houseprofileid: string
): Promise<{ success: boolean; message?: string }> => {
  const supabase = await createSupbaseServerClient();

  try {
    // Delete family member
    const { error: famMemberError } = await supabase
      .from("FamMember")
      .delete()
      .eq("MemberId", famID);

    if (famMemberError) {
      console.error("Error deleting FamMember:", famMemberError.message);
      return { success: false, message: famMemberError.message };
    }

    // Get current member count
    const { data: remainingMembers, error: countError } = await supabase
      .from("FamMember")
      .select("MemberId")
      .eq("HouseProfileId", houseprofileid);

    if (countError) {
      console.error("Error counting members:", countError.message);
      return { success: false, message: countError.message };
    }

    // Update HouseProfile with new count
    const { error: updateError } = await supabase
      .from("HouseProfile")
      .update({ NumberofMembers: remainingMembers.length })
      .eq("HouseProfileId", houseprofileid);

    if (updateError) {
      console.error("Error updating member count:", updateError.message);
      return { success: false, message: updateError.message };
    }

    await InsertLogForUpdate(
      "Delete FamMember",
      `Deleted FamMember with ID ${famID}`,
      famID
    );
    return { success: true };
  } catch (error) {
    console.error("An error occurred during deletion:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
