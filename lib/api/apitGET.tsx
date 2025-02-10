"use server";

import { createSupbaseServerClient } from "../supabase";

export const getAllHouseProfile = async () => {
  try {
    const supabase = await createSupbaseServerClient();
    const { data, error } = await supabase.from("HouseProfile").select(`
                  *,
                  Location(*), 
                  Pet(*),
                  FamMember(*),
                  Apartment(*)
              `);

    if (error) {
      console.error("Error fetching house profiles:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getHouseProfileByCreator = async (user: any) => {
  try {
    const supabase = await createSupbaseServerClient();

    const { data: Member, error: memberError } = await supabase
      .from("member")
      .select("*, permission(*)")
      .eq("email", user.email);

    if (memberError) {
      console.error("Error fetching member data:", memberError);
      return [];
    }

    if (Member) {
      const agentId = Member[0].permission[0].agent_id;

      const { data: HouseProfile, error: houseProfileError } = await supabase
        .from("HouseProfile")
        .select(
          `
                      *,
                      Location(*), 
                      Pet(*),
                      FamMember(*),
                      Apartment(*)
                  `
        )
        .eq("AgentId", agentId);

      if (houseProfileError) {
        console.error("Error fetching house profiles:", houseProfileError);
        return [];
      }

      return HouseProfile || [];
    }

    console.warn("No member found for the provided email.");
    return [];
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};

export const getFamMember = async () => {
  const groupByHouseProfileId = (famMemberData: any[], locationData: any[]) => {
    const combinedData: Record<string, any> = {};

    // Process FamMember Data
    famMemberData.forEach((item) => {
      const houseProfileId = item.HouseProfileId;
      if (!combinedData[houseProfileId]) {
        combinedData[houseProfileId] = { FamMembers: [], Locations: [] };
      }
      combinedData[houseProfileId].FamMembers.push(item);
    });

    // Process Location Data
    locationData.forEach((item) => {
      const houseProfileId = item.HouseProfileId;
      if (!combinedData[houseProfileId]) {
        combinedData[houseProfileId] = { FamMembers: [], Locations: [] };
      }
      combinedData[houseProfileId].Locations.push(item);
    });

    return Object.values(combinedData);
  };

  try {
    const supabase = await createSupbaseServerClient();

    // Fetch the two sets of data from 2024
    const { data: FamMember, error: fammemberError } = await supabase
      .from("FamMember")
      .select("*");

    const { data: Location, error: locationError } = await supabase
      .from("Location")
      .select("*");

    if (fammemberError || locationError) {
      console.log("Something went wrong fetching Census Data");
      return [];
    }

    // Group data by HouseProfileId
    const groupedData = groupByHouseProfileId(FamMember, Location);

    return groupedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getHouseProfileLocation = async () => {
  try {
    const supabase = await createSupbaseServerClient();

    const { data, error } = await supabase.from("HouseProfile").select(`
                  *,
                  Location(*)
              `);

    if (error) {
      console.log(error);
      return [];
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllMembers = async () => {
  try {
    const supabase = await createSupbaseServerClient();

    const { data: response, error } = await supabase
      .from("HouseProfile")
      .select("*, FamMember(*), Location(*)");

    if (error) return { response: [], msg: "Error fetching members" };

    // Combine all FamMembers from all house profiles into a single array
    const allMembers = response.flatMap((house) =>
      house.FamMember.map((member: any) => {
        // Find the Kilometer value from the Location array
        const kilometer =
          house.Location.find((location: any) => location.Kilometer)
            ?.Kilometer || null;

        return {
          ...member,
          familyclass: house.FamClass,
          kilometer: kilometer,
          HouseProfile: {
            location: house.Location[0],
            houseprofile: {
              HouseNumber: house.HouseNumber,
              ContactNumber: house.ContactNumber,
              HouseProfileId: house.HouseProfileId, // Corrected column name
              LocationId: house.locationID,
              NumberofMembers: house.NoMember,
              NumberOfFamily: house.NumberOfFamily,
              AgentName: house.agentName,
              AgentId: house.agentId,
              RespondentName: house.RespondentName,
              RespondentSignature: house.RespondentSignature,
              DoYouHave: house.DoYouHave,
              HouseHoldUses: house.HouseHoldUses,
              Vehicle: house.Vehicle,
              Devices: house.Devices,
              Appliances: house.Appliances,
              FamClass: house.FamClass,
              TotalHouseHoldIncome: house.TotalHouseHoldIncome,
              Note: house.Note,
            },
          },
        };
      })
    );

    return { response: allMembers, msg: "" };
  } catch (error) {
    console.error("Error:", error);
    return { response: [], msg: "An error occurred while fetching members" };
  }
};

export const getLog = async () => {
  try {
    const supabase = await createSupbaseServerClient();

    let { data: Log, error } = await supabase.from("Log").select("*");

    if (error) {
      console.error("Error fetching logs:", error.message);
      return;
    }

    return Log;
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};
