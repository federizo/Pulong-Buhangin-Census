/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { updateChecker } from "@/lib/api/apiUPDATE";
import CensusForm from "../../../../components/ui_census/census_form";
import MemberModal from "../../../../components/ui_census/member_modal";
import { HouseProfileDELETE } from "@/lib/api/apiDELETE";
import { Spinner } from "@nextui-org/spinner";
import Consent from "./consent_modal";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidatePath, unstable_noStore } from "next/cache";


const CensusModal = ({
  openModal,
  setOpenModal,
  item,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  item: any;
}) => {
  const [formData, setFormData] = useState<any>({ id: item.id, });

  const [memberForm, setMemberForm] = useState({
    MemberId: "",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    Suffix: "",
    FamilyRelationship: "",
    Birthday: "",
    Age: 0,
    Gender: "",
    CivilStatus: "",
    Occupation: { value: "", other: "" },
    Education: { elem: false, hs: false, college: false, other: false },
    Religion: { value: "", other: "" },
    Sector: { src: false, sp: false, fourps: false },
    Lactating: false,
    LactatingMonths: 0,
    Immunization: {},
    Disability: "",
    Weight: "",
    Height: "",
  });

  useLayoutEffect(() => {
    if (item === null) return;
    setFormData({
      id: item.id,
      created_at: item.created_at,
      HouseNumber: item.HouseNumber,
      BcNumber: item.BcNumber,
      ContactNumber: item.ContactNumber,
      HouseProfileId: item.HouseProfileId,
      LocationId: item.LocationId,
      NumberofMembers: item.NumberofMembers,
      NumberOfFamily: item.NumberOfFamily,
      FamClass: item.FamClass,
      TotalHouseHoldIncome: item.TotalHouseHoldIncome,
      AgentId: item.AgentId,
      RespondentName: item.RespondentName,
      RespondentSignature: item.RespondentSignature,
      DoYouHave: item.DoYouHave,
      HouseHoldUses: item.HouseHoldUses,
      Devices: item.Devices,
      Vehicle: item.Vehicle,
      Appliances: item.Appliances,
      Location: item.Location[0],
      Pet: item.Pet[0],
      FamMember: item.FamMember,
      Apartment: item.Apartment[0],
      Note: item.Note,
    })
  }, [item])


  const [selectedUser, setSelectedUser] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const originalFormData = useRef(formData);

  const deepCompare = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(!deepCompare(originalFormData.current, formData));
  }, [formData]);

  const handleUpdate = async () => {
    if (deepCompare(originalFormData.current, formData)) {
      alert("No changes detected.");
      return;
    }

    if (parseFloat(formData.TotalHouseHoldIncome) < 0) {
      return alert("Can't allow lower than 0 for monthly income!");
    }
    setUpdating(true);
    setFormData((prev: any) => ({
      ...prev,
      NumberofMembers: formData.FamMember.length,
    }));

    if (await updateChecker(formData, originalFormData.current))
      alert("Update successful.");
    setOpenModal(false);
    originalFormData.current = { ...formData }; // Update reference with latest data
    setUpdating(false);
  };

  const handleCloseModal = () => {
    setEdit(true);
    setOpenModal(false);
  };

  const handleEdit = () => {
    setEdit(!edit);
    setSelectedUser([]);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleDoDelete = async () => {
    try {
      setDeleting(true);

      // Delete the record and handle potential errors
      const status = await HouseProfileDELETE(item.HouseProfileId);

      if (status.success) {
        setDeleteModal(false);
        location.reload();
      } else {
        alert(`Failed to delete: ${status.message}`);
        console.error("Deletion failed:", status.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("An error occurred during deletion:", error);
    } finally {
      setDeleting(false);
    }
  };
  if (!openModal) return null;

  return (
    <div className="w-screen h-screen flex justify-center items-center inset-0 fixed backdrop-blur-sm py-[5vh]">
      <div className="bg-white dark:bg-zinc-900 flex-col flex gap-y-5 lg:w-[70vh] w-full h-full rounded-md shadow-md shadow-slate-950 border-[0.5px] py-5 px-3 z-0">


        {deleting ? (
          <div className="w-[99%] h-full flex flex-col gap-6 p-4 relative">
            {/* Personal Information Group */}
            <div className="space-y-4">
              <Skeleton className="w-32 h-6 rounded-md" /> {/* Section Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" />{" "}
                {/* First Name */}
                <Skeleton className="w-full h-10 rounded-lg" />{" "}
                {/* Last Name */}
              </div>
              <Skeleton className="w-3/4 h-10 rounded-lg" /> {/* Email */}
            </div>

            {/* Address Group */}
            <div className="space-y-4">
              <Skeleton className="w-24 h-6 rounded-md" /> {/* Section Label */}
              <Skeleton className="w-full h-10 rounded-lg" />{" "}
              {/* Street Address */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" /> {/* City */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* State */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* ZIP */}
                <Skeleton className="w-full h-10 rounded-lg" /> {/* Country */}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-4">
              <Skeleton className="w-40 h-6 rounded-md" /> {/* Section Label */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-full h-10 rounded-lg" />
                <Skeleton className="w-2/3 h-10 rounded-lg" />
              </div>
            </div>

            <div className="absolute backdrop-blur-[2px] flex items-center justify-center w-full h-full tracking-widest text-lg bg-black bg-opacity-65">
              <Spinner
                color="primary"
                label="Please wait don't refresh while processing the deletion..."
                labelColor="primary"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-4">
                {edit ? (
                  <button
                    onClick={() => handleEdit()}
                    className="border-[1px] duration-300 hover:bg-blue-600 px-5 py-1 rounded-md flex gap-1 items-center"
                  >
                    <FaRegEdit />
                    EDIT
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit()}
                    className="border-[1px] duration-300 hover:bg-red-300 bg-red-600 px-5 py-1 rounded-md flex gap-1 items-center"
                  >
                    CANCEL
                  </button>
                )}
                {hasChanges && (
                  <button
                    onClick={handleUpdate}
                    className="border-[1px] duration-300 px-5 py-1 rounded-md flex gap-1 items-center hover:bg-blue-600"
                  >
                    UPDATE
                  </button>
                )}
                {!edit && (
                  <>
                    <button
                      onClick={() => handleDelete()}
                      className="border-[1px] duration-300 px-5 py-1 rounded-md flex gap-1 items-center hover:bg-slate-300 hover:text-black"
                    >
                      DELETE
                    </button>

                    <Consent
                      deleteModal={deleteModal}
                      setDeleteModal={setDeleteModal}
                      onConfirm={handleDoDelete}
                    />
                  </>
                )}
              </div>

              <div className="flex">
                <button
                  onClick={() => handleCloseModal()}
                  className="hover:text-red-500 text-[4vh] duration-300"
                >
                  <IoClose />
                </button>
              </div>
            </div>
            {!updating ? (
              <div className="w-full flex flex-col h-full overflow-y-auto overflow-x-hidden">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Spinner
                      color="primary"
                      label="Fetching Data..."
                      labelColor="primary"
                    />
                  </div>
                ) : (
                  <>
                    <CensusForm
                      formData={formData}
                      setFormData={setFormData}
                      memberForm={memberForm}
                      setMemberForm={setMemberForm}
                      edit={edit}
                      setEdit={setEdit}
                      setSelectedUser={setSelectedUser}
                    />

                    {formData.RespondentSignature !== null &&
                      formData.RespondentName !== null && (
                        <div className="mt-5 w-full items-center justify-center flex flex-col">
                          <Image
                            src={formData.RespondentSignature}
                            width={200}
                            height={200}
                            alt="Respondent signature"
                            className="p-5 invert-0 dark:invert"
                          />
                          <label className="-mt-4">
                            {formData.RespondentName}
                          </label>
                        </div>
                      )}
                  </>
                )}

                {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                <MemberModal
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner
                  color="primary"
                  label="Updating Data..."
                  labelColor="primary"
                />
                <label>Please wait.</label>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CensusModal;
