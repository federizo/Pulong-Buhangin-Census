
export const checkApartment = (current: any, prev: any) => {
    const curr = {
        DoorNo: current.Apartment.DoorNo,
        FloorNo: current.Apartment.FloorNo,
        APTOwner: current.Apartment.APTOwner,
        HouseType: current.Apartment.HouseType,
        HouseToilet: current.Apartment.HouseToilet,
        WaterSource: current.Apartment.WaterSource,
    }
    const pre = {
        DoorNo: prev.Apartment.DoorNo,
        FloorNo: prev.Apartment.FloorNo,
        APTOwner: prev.Apartment.APTOwner,
        HouseType: prev.Apartment.HouseType,
        HouseToilet: prev.Apartment.HouseToilet,
        WaterSource: prev.Apartment.WaterSource,
    }
    if (JSON.stringify(pre) !== JSON.stringify(curr))
        return true
    else
        return false
}

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
    }
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
    }

    if (JSON.stringify(pre) !== JSON.stringify(curr))
        return true
    else
        return false
}


export const checkLocation = (current: any, prev: any) => {
    const curr = {
        Street: current.Location.Street,
        Block: current.Location.Block,
        Lot: current.Location.Lot,
        Phase: current.Location.Phase,
        Kilometer: current.Location.Kilometer,
        SubdivisionName: current.Location.SubdivisionName,
    }
    const pre = {
        Street: prev.Location.Street,
        Block: prev.Location.Block,
        Lot: prev.Location.Lot,
        Phase: prev.Location.Phase,
        Kilometer: prev.Location.Kilometer,
        SubdivisionName: prev.Location.SubdivisionName,
    }

    if (JSON.stringify(pre) !== JSON.stringify(curr))
        return true
    else
        return false
}

export const checkPet = (current: any, prev: any) => {
    const curr = {
        TypeofPet: current.Pet.TypeofPet,
        Remarks: current.Pet.Remarks,
        NumberofPet: current.Pet.NumberofPet,
    }
    const pre = {
        TypeofPet: prev.Pet.TypeofPet,
        Remarks: prev.Pet.Remarks,
        NumberofPet: prev.Pet.NumberofPet,
    }

    if (JSON.stringify(pre) !== JSON.stringify(curr))
        return true
    else
        return false
}
export const checkFamMember = (current: any, prev: any) => {
    const curr = current.FamMember
    const pre = prev.FamMember

    if (JSON.stringify(pre) !== JSON.stringify(curr))
        return true
    else
        return false
}

