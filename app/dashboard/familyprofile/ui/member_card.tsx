"use client";

import React, { useEffect, useRef, useState } from "react";
import MemberModalFamilyProfile from "./member_modal_familyprofile";

const MemberCard = ({ item }: { item: any }) => {
  const [modal, setModal] = useState<boolean>(false);
  const [modalHouse, setModalHouse] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-5 gap-3 uppercase text-center border-b border-zinc-800 py-2 px-4 items-center">
        <label className="truncate overflow-hidden">
          {item.FirstName} {item.MiddleName} {item.LastName} {item.Suffix}
        </label>
        <label className="truncate overflow-hidden">{item.Gender}</label>
        <label className="truncate overflow-hidden">{item.Age}</label>
        <label className="truncate overflow-hidden">{item.CivilStatus}</label>
        <div className="flex items-center justify-center gap-2 sm:flex-col sm:w-full"> 
  <button
    onClick={() => setModal(!modal)}
    className="border bg-green-400 border-zinc-800 px-5 py-1 rounded-md duration-300 hover:bg-green-600 sm:w-full"
  >
    DETAILS
  </button>

  <button
    onClick={() => setModalHouse(!modal)}
    className="border bg-blue-400 border-zinc-800 py-1 rounded-md duration-300 hover:bg-blue-600 sm:w-full"
  >
    HOUSEPROFILE
  </button>
</div>
      </div>

      <MemberModalFamilyProfile item={item} modal={modal} setModal={setModal} />
      <HouseProfileModal
        item={item.HouseProfile}
        open={modalHouse}
        setOpen={setModalHouse}
      />
    </div>
  );
};

export default MemberCard;

const HouseProfileModal = ({
  item,
  open,
  setOpen,
}: {
  item: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const refDiv = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (refDiv.current && !refDiv.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!open) return null;
  return (
    <div className="inset-0 fixed z-50 w-screen h-screen flex items-center justify-center backdrop-blur-sm overflow-auto">
      <div
        ref={refDiv}
        className="min-w-[300px] max-w-1/2 h-auto border-[1px] border-zinc-800 dark:bg-zinc-900 bg-white grid grid-cols-1 p-5 rounded-md text-lg"
      >
        <h1 className="italic font-semibold text-2xl py-2 tracking-wider">
          ADDRESS
        </h1>
        <label className="houseprofile_fam">
          HOUSEPROFILE ID:{" "}
          <span className="houseprofile_span">
            {item.houseprofile.HouseProfileId}
          </span>
        </label>
        <label className="houseprofile_fam">
          HOUSE NO.:{" "}
          <span className="houseprofile_span">
            {item.houseprofile.HouseNumber}
          </span>
        </label>
        <label className="houseprofile_fam">
          HOUSE CONTACT NO.:{" "}
          <span className="houseprofile_span">
            {item.houseprofile.ContactNumber}
          </span>
        </label>
        <label className="houseprofile_fam">
          KILOMETER:{" "}
          <span className="houseprofile_span">{item.location.Kilometer}</span>
        </label>
        <label className="houseprofile_fam">
          STREET:{" "}
          <span className="houseprofile_span">{item.location.Street}</span>
        </label>
        <label className="houseprofile_fam">
          SUBDIVISION:{" "}
          <span className="houseprofile_span">
            {item.location.SubdivisionName}
          </span>
        </label>
        <label className="houseprofile_fam">
          BLOCK:{" "}
          <span className="houseprofile_span">{item.location.Block}</span>
        </label>
        <label className="houseprofile_fam">
          LOT: <span className="houseprofile_span">{item.location.Lot}</span>
        </label>
        <label className="houseprofile_fam">
          PHASE:{" "}
          <span className="houseprofile_span">{item.location.Phase}</span>
        </label>
        <label className="houseprofile_fam">
          FAMILY CLASS:{" "}
          <span className="houseprofile_span uppercase">
            {item.houseprofile.FamClass}
          </span>
        </label>
      </div>
    </div>
  );
};