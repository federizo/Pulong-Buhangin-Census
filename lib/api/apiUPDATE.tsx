"use server"

import {
    checkApartment,
    checkFamMember,
    checkHouseProfile,
    checkLocation,
    checkPet
} from "@/components/filter/checker";
import { createSupbaseServerClient } from "../supabase";
import { LogInsert } from "./apiINSERT";
import { getServerSideCookies } from "../util/cookies";

export const updateChecker = async (formData: any, prevformData: any) => {
    const responseHouseProfile: any = checkHouseProfile(formData, prevformData);
    const responseLocation = checkLocation(formData, prevformData);
    const responseFamMember = checkFamMember(formData, prevformData);
    const responseApartment = checkApartment(formData, prevformData);
    const responsePet = checkPet(formData, prevformData);

    if (responseHouseProfile || responseFamMember) await updateHouseProfile(formData);
    if (responseLocation) await updateLocation(formData);
    if (responseFamMember) await updateFamMember(formData, prevformData);
    if (responseApartment) await updateApartment(formData);
    if (responsePet) await updatePet(formData);

    return true;
};

const updateHouseProfile = async (data: any) => {
    const supabase = await createSupbaseServerClient()
    console.log(data.FamMember);

    const { error } = await supabase
        .from('HouseProfile')
        .update({
            HouseNumber: data.HouseNumber,
            ContactNumber: data.ContactNumber,
            NumberofMembers: data.FamMember.length,
            NumberOfFamily: data.NumberOfFamily,
            AgentId: data.current,
            DoYouHave: data.DoYouHave,
            HouseHoldUses: data.HouseHoldUses,
            Devices: data.Devices,
            Vehicle: data.Vehicle,
            Appliances: data.Appliances,
            Note: data.Note,
            FamClass: data.FamClass,
            TotalHouseHoldIncome: data.TotalHouseHoldIncome
        })
        .eq('HouseProfileId', data.HouseProfileId)
        .select()

    InsertLogForUpdate("Update HouseProfile", `Updated HouseProfileId with ID number of ${data.HouseProfileId}`, data)
    if (error)
         return alert("updateHouseProfile: " + error.message)

    return true
};

const updateApartment = async (data: any) => {
    const supabase = await createSupbaseServerClient()

    const { error } = await supabase
        .from('Apartment')
        .update({
            DoorNo: data.Apartment.DoorNo,
            FloorNo: data.Apartment.FloorNo,
            APTOwner: data.Apartment.APTOwner,
            HouseType: data.Apartment.HouseType,
            HouseToilet: data.Apartment.HouseToilet,
            WaterSource: data.Apartment.WaterSource,
        })
        .eq('HouseProfileId', data.HouseProfileId)
        .select()
    InsertLogForUpdate("Update Apartment", `Updated HouseProfileId with ID number of ${data.HouseProfileId}`, data)
    if (error) return alert("updateApartment: " + error.message)
    return true
};

const updateFamMember = async (data: any, prevdata: any) => {
    // Find new family members
    const newFamMembers = data.FamMember.filter((newMember: any) => {
        return !prevdata.FamMember.some((oldMember: any) => oldMember.MemberId === newMember.MemberId);
    });

    // Find updated existing family members
    const updateExistingFamMembers = data.FamMember
        .map((newMember: any) => {
            const oldMember = prevdata.FamMember.find((old: any) => old.MemberId === newMember.MemberId);

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
            return undefined; // No changes or not found
        })
        .filter((member: any) => member !== undefined); // Remove undefined values

    // Find removed family members
    const removedFamMembers = prevdata.FamMember.filter((oldMember: any, index: number, self: any[]) => {
        // Check if the current oldMember is not in data.FamMember
        const isNotInNewData = !data.FamMember.some((newMember: any) => newMember.MemberId === oldMember.MemberId);

        // Ensure no duplicates in the final array
        const isUnique = self.findIndex((member) => member.MemberId === oldMember.MemberId) === index;

        return isNotInNewData && isUnique;
    });

    // Insert new members
    if (newFamMembers.length > 0) {
        console.log("New family members detected:", newFamMembers);
        insertNewMember(newFamMembers, data);
    }

    // Update existing members
    if (updateExistingFamMembers.length > 0) {
        console.log("Updated family members detected:", updateExistingFamMembers);
        updateMember(updateExistingFamMembers, data);
        InsertLogForUpdate(
            "Update Member",
            `Updated member list for HouseProfileId with ID number of ${data.HouseProfileId}`,
            data
        );
    }

    // Handle removed members
    if (removedFamMembers.length > 0) {
        console.log("Removed family members detected:", removedFamMembers);
        deleteMember(removedFamMembers, data);

    }


    return {
        newFamMembers,
        updateExistingFamMembers,
        removedFamMembers,
    };
};


const insertNewMember = async (newFamMembers: any, data: any) => {
    let successfulInserts = 0;
    const Insert = async (member: any): Promise<boolean> => {
        try {
            // Validate required fields
            if (!member.MemberId || !member.FirstName || !member.LastName) {
                throw new Error(`Missing required fields for member: ${JSON.stringify(member)}`);
            }

            const supabase = await createSupbaseServerClient()
            // Perform the insertion
            const { error } = await supabase
                .from("FamMember")
                .insert([
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
                        HouseProfileId: data.HouseProfileId,
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
    for (const member of newFamMembers) {
        const isInserted = await Insert(member);
        if (isInserted) successfulInserts++;
    }

    // Return true if all members were successfully inserted
    return successfulInserts === newFamMembers.length;
}

const updateMember = async (updateExistingFamMembers: any, data: any) => {
    let successfulInserts = 0;
    const Insert = async (member: any): Promise<boolean> => {
        try {
            // Validate required fields
            if (!member.MemberId || !member.FirstName || !member.LastName) {
                throw new Error(`Missing required fields for member: ${JSON.stringify(member)}`);
            }

            const supabase = await createSupbaseServerClient()
            // Perform the insertion
            const { error } = await supabase
                .from("FamMember")
                .update({
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
                    HouseProfileId: data.HouseProfileId,
                },)
                .eq('MemberId', member.MemberId)
                .select()
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
    for (const member of updateExistingFamMembers) {
        const isInserted = await Insert(member);
        if (isInserted) successfulInserts++;
    }

    // Return true if all members were successfully inserted
    return successfulInserts === updateExistingFamMembers.length;
}

const deleteMember = async (updateExistingFamMembers: any, data: any) => {
    let successfulInserts = 0;
    const DeleteMember = async (member: any): Promise<boolean> => {
        try {

            const supabase = await createSupbaseServerClient()

            console.log(member);

            const { error } = await supabase
                .from('FamMember')
                .delete()
                .eq('MemberId', member.MemberId)

            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }

            // Log the update
            InsertLogForUpdate(
                "Delete Member",
                `Deleted member for HouseProfileId with ID number of ${data.HouseProfileId} and member ID of ${member.MemberId}`,
                data
            );

            return true;
        } catch (error) {
            console.error(`Failed to insert member ${member.MemberId}:`, error);
            return false;
        }
    };

    // Loop through all members in the FamMember array
    for (const member of updateExistingFamMembers) {
        const isInserted = await DeleteMember(member);
        if (isInserted) successfulInserts++;
    }

    // Return true if all members were successfully inserted
    return successfulInserts === updateExistingFamMembers.length;
}

const updateLocation = async (data: any) => {
    const supabase = await createSupbaseServerClient()

    const { error } = await supabase
        .from('Location')
        .update({
            Street: data.Location.Street,
            Block: data.Location.Block,
            Lot: data.Location.Lot,
            Phase: data.Location.Phase,
            Kilometer: data.Location.Kilometer,
            SubdivisionName: data.Location.SubdivisionName,
        })
        .eq('HouseProfileId', data.HouseProfileId)
        .select()
    InsertLogForUpdate("Update Location", `Updated Location of HouseProfileId with ID number of ${data.HouseProfileId}`, data)
    if (error) return alert("updateLocation: " + error.message)
    return true

};

const updatePet = async (data: any) => {
    const supabase = await createSupbaseServerClient()

    const { error } = await supabase
        .from('Pet')
        .update({
            TypeofPet: data.Pet.TypeofPet,
            Remarks: data.Pet.Remarks,
            NumberofPet: data.Pet.NumberofPet,
        })
        .eq('HouseProfileId', data.HouseProfileId)
        .select()
    InsertLogForUpdate("Update Location", `Updated Location of HouseProfileId with ID number of ${data.HouseProfileId}`, data)
    if (error) return alert("updatePet: " + error.message)
    return true

};


export const updateSingleMember = async (item: any, prevItem: any) => {

    const supabase = await createSupbaseServerClient()
    // Perform the insertion

    const { error } = await supabase
        .from("FamMember")
        .update({
            LastName: item.LastName,
            FirstName: item.FirstName,
            MiddleName: item.MiddleName,
            Suffix: item.Suffix,
            FamilyRelationship: item.FamilyRelationship,
            Birthday: item.Birthday,
            Age: item.Age,
            Gender: item.Gender,
            Occupation: item.Occupation,
            Education: item.Education,
            Religion: item.Religion,
            Sector: item.Sector,
            Lactating: item.Lactating,
            LactatingMonths: item.LactatingMonths,
            CivilStatus: item.CivilStatus,
            Disability: item.Disability,
            Immunization: item.Immunization,
            Weight: item.Weight,
            Height: item.Height,
        },)
        .eq('MemberId', item.MemberId)

    InsertLogForUpdate("Update Single Member", `Updated Single Member with the name of ${item.FirstName} ${item.LastName}`, item.HouseProfileId)
    if (error) return { msg: "Something wen't worong.." }
    return { msg: "Successfully update member" }

}


export const InsertLogForUpdate = async (action: string, desc: string, data_id: any) => {
    try {
        const response: any = await getServerSideCookies();
        const parse: any = JSON.parse(response);
        const id = parse.user.id;

        const supabase = await createSupbaseServerClient();
        const { data: Member, error: memberError } = await supabase
            .from("member")
            .select("*")
            .eq("id", id)
            .single();

        const { data: Permission, error: permissionError } = await supabase
            .from("permission")
            .select("*")
            .eq("member_id", id)
            .single();


        if (memberError || permissionError) {
            console.error("Error fetching member:", memberError);
            return;
        }

        if (Member && Permission)
            LogInsert(Permission.agent_id, Member.name, action, desc, data_id.HouseProfileId);
        else
            return console.log("Error Inserting Log")

    } catch (error) {
        console.error("Error in InsertLogForUpdate:", error);
    }
};