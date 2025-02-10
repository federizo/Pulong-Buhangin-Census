import React from "react";

// Define Props interface
interface ConsentProps {
    deleteModal: boolean;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void; // Correct type for handling the confirmation
}

const Consent: React.FC<ConsentProps> = ({ deleteModal, setDeleteModal, onConfirm }) => {
    if (!deleteModal) return null; // Render nothing if modal shouldn't show

    return (
        <div className="inset-0 fixed w-screen h-screen flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="w-[400px] h-[150px] bg-white dark:bg-black border-[1px] rounded-md flex flex-col items-center justify-center">
                <label className="font-semibold tracking-wide text-xl ">Would you like to continue?</label>
                <div className="mt-4 flex space-x-2">
                    <button
                        className="px-4 py-2 hover:bg-blue-500  rounded-md"
                        onClick={() => {
                            onConfirm(); // Trigger the confirm logic
                            setDeleteModal(false); // Close the modal
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="px-4 py-2 hover:bg-red-500  rounded-md"
                        onClick={() => setDeleteModal(false)} // Just close the modal
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Consent;