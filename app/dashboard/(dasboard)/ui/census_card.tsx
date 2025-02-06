import React, { useRef, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import CensusModal from "./census_modal";
import PDF_LAYOUT from "@/components/ui_export/pdf_format";

interface CensusItem {
    HouseNumber: string | number;
    ContactNumber: string;
    NumberofMembers: number;
    AgentId: number;
    AgentName: string;
}


const CensusCard = ({ item }: { item: CensusItem }) => {
    const [openModal, setOpenModal] = useState(false);

    const handleViewModal = () => setOpenModal((prev) => !prev);

    return (
        <>
            <div className="grid grid-cols-5 px-5 py-2 gap-5 border-b dark:border-zinc-600">
                <p className="text-center truncate overflow-hidden">{item.HouseNumber}</p>
                <p className="text-center truncate overflow-hidden">{item.ContactNumber}</p>
                <p className="text-center truncate overflow-hidden">{item.NumberofMembers}</p>
                <p className="text-center truncate overflow-hidden">{item.AgentName}</p>
                <div className="text-sm text-center gap-2 gap-y-4 flex flex-wrap lg:flex-nowrap items-center">
                    <button
                        onClick={handleViewModal}
                        className="border-[1px] duration-300 bg-green-400 hover:bg-green-600 px-5 py-1 rounded-md flex gap-1 items-center"
                        aria-label="View Details"
                    >
                        <IoEyeOutline />
                        VIEW
                    </button>
                    <PDF_LAYOUT item={item} />
                </div>
            </div>
            <CensusModal openModal={openModal} setOpenModal={setOpenModal} item={item} />
        </>
    );
};

export default CensusCard;
