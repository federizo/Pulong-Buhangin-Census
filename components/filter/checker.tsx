export const checkApartment = (current: any, prev: any) => {
  const safeCurrent = current?.Apartment || {}; // Ensure Apartment exists
  const safePrev = prev?.Apartment || {}; // Ensure Apartment exists

  const curr = {
    DoorNo: safeCurrent.DoorNo || "", // Default empty string if undefined
    FloorNo: safeCurrent.FloorNo || "",
    APTOwner: safeCurrent.APTOwner || "",
    HouseType: safeCurrent.HouseType || "",
    HouseToilet: safeCurrent.HouseToilet || "",
    WaterSource: safeCurrent.WaterSource || "",
  };

  const pre = {
    DoorNo: safePrev.DoorNo || "",
    FloorNo: safePrev.FloorNo || "",
    APTOwner: safePrev.APTOwner || "",
    HouseType: safePrev.HouseType || "",
    HouseToilet: safePrev.HouseToilet || "",
    WaterSource: safePrev.WaterSource || "",
  };

  return JSON.stringify(pre) !== JSON.stringify(curr);
};

export const checkHouseProfile = (current: any, prev: any) => {
  const curr = {
    id: current.id,
    created_at: current.created_at,
    HouseNumber: current.HouseNumber,
    ContactNumber: current.ContactNumber,
    HouseProfileId: current.HouseProfileId,
    LocationId: current.LocationId,
    NumberofMembers: current.NumberofMembers,
    AgentId: current.current,
    DoYouHave: current.DoYouHave,
    HouseHoldUses: current.HouseHoldUses,
  };
  const pre = {
    id: prev.id,
    created_at: prev.created_at,
    HouseNumber: prev.HouseNumber,
    ContactNumber: prev.ContactNumber,
    HouseProfileId: prev.HouseProfileId,
    LocationId: prev.LocationId,
    NumberofMembers: prev.NumberofMembers,
    AgentId: prev.prev,
    DoYouHave: prev.DoYouHave,
    HouseHoldUses: prev.HouseHoldUses,
  };

  if (JSON.stringify(pre) !== JSON.stringify(curr)) return true;
  else return false;
};

export const checkLocation = (current: any, prev: any) => {
  const safeCurrent = current?.Location || {}; // Ensure Location exists
  const safePrev = prev?.Location || {}; // Ensure Location exists

  const curr = {
    Street: safeCurrent.Street || "", // Default empty string if undefined
    Block: safeCurrent.Block || "",
    Lot: safeCurrent.Lot || "",
    Phase: safeCurrent.Phase || "",
    Kilometer: safeCurrent.Kilometer || "",
    SubdivisionName: safeCurrent.SubdivisionName || "",
  };

  const pre = {
    Street: safePrev.Street || "",
    Block: safePrev.Block || "",
    Lot: safePrev.Lot || "",
    Phase: safePrev.Phase || "",
    Kilometer: safePrev.Kilometer || "",
    SubdivisionName: safePrev.SubdivisionName || "",
  };

  return JSON.stringify(pre) !== JSON.stringify(curr);
};

export const checkPet = (current: any, prev: any) => {
  const safeCurrent = current?.Pet || {}; // Ensure Pet exists
  const safePrev = prev?.Pet || {}; // Ensure Pet exists

  const curr = {
    TypeofPet: safeCurrent.TypeofPet || "", // Default empty string if undefined
    Remarks: safeCurrent.Remarks || "",
    NumberofPet: safeCurrent.NumberofPet || 0, // Default to 0 for numbers
  };

  const pre = {
    TypeofPet: safePrev.TypeofPet || "",
    Remarks: safePrev.Remarks || "",
    NumberofPet: safePrev.NumberofPet || 0, // Default to 0 for numbers
  };

  return JSON.stringify(pre) !== JSON.stringify(curr);
};

export const checkFamMember = (current: any, prev: any) => {
  const curr = current.FamMember;
  const pre = prev.FamMember;

  if (JSON.stringify(pre) !== JSON.stringify(curr)) return true;
  else return false;
};
