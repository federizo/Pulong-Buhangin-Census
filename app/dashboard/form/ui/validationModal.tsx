import React, { useState } from "react";
import { agentValidation } from "../agentValidation";
import { IoClose } from "react-icons/io5";
import api from "@/lib/api/apiINSERT";
import { Spinner } from "@nextui-org/spinner";
import SignaturePad from "./signature_ui";
import { toast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ValidationModalProps {
  openvalidationmodal: boolean;
  setOpenvalidationmodal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
  formClearInputs: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ValidationModal: React.FC<ValidationModalProps> = ({
  openvalidationmodal,
  setOpenvalidationmodal,
  setLoading,
  formClearInputs,
  formData,
  setFormData,
  message = "Validation in progress...",
}) => {
  const [agentId, setAgentId] = useState<string>(""); // ✅ OTP Input for Agent ID
  const [agentName, setAgentName] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleValidation = async () => {
    try {
      const { isValid, message, agentData } = await agentValidation(agentId);
      setValid(isValid);
      alert(message);
      setAgentName(agentData.name);
    } catch (error) {
      console.error("Error during validation:", message);
    }
  };

  const handleSaveData = async () => {
    try {
      setSubmitting(true);
      if (formData.TotalHouseHoldIncome < 0) {
        alert("Please Don't Input Negative Number!");
        return;
      }

      if (!valid) {
        alert(message);
        setAgentId("");
        setOpenvalidationmodal(false);
        return;
      }

      setLoading(true);
      const insertStatus = await api(formData, agentName, agentId);

      if (insertStatus) {
        sessionStorage.clear();
        formClearInputs();
        alert("Submission successful!");
      } else {
        alert(message || "Submission failed!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data");
    } finally {
      setSubmitting(false);
      setLoading(false);
      setOpenvalidationmodal(false);
      location.reload();
    }
  };

  if (!openvalidationmodal) return null;
  return (
    <div
      className="inset-0 fixed h-screen w-screen backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {submitting ? (
        <Spinner color="primary" size="lg" />
      ) : (
        <div className="bg-white dark:bg-zinc-900 w-[400px] p-4 rounded shadow-lg shadow-gray-950 flex flex-col gap-4 border-[1px]">
          <div className="w-full flex justify-end">
            <label
              onClick={() => setOpenvalidationmodal(false)}
              className="text-2xl hover:text-red-500 cursor-pointer"
            >
              <IoClose />
            </label>
          </div>

          {!valid ? ( // ✅ First Condition: Agent Validation
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-black dark:text-white">Agent Validation</h2>
              <label className="text-gray-400">Enter your Agent ID</label>

              <InputOTP maxLength={6} value={agentId} onChange={setAgentId}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <button
                className="mt-4 px-4 py-2 w-full bg-blue-500 hover:bg-blue-800 transition text-white rounded"
                onClick={handleValidation}
                disabled={agentId.length !== 6} // ✅ Enable only when 6 digits are entered
              >
                Validate
              </button>
            </div>
          ) : ( // ✅ Second Condition: Respondent Form
            <div className="w-full h-auto flex flex-col gap-4">
              <SignaturePad setFormData={setFormData} />

              {formData.RespondentSignature !== "" && (
                <>
                  <div className="flex flex-col mt-4">
                    <label className="italic text-black dark:text-white tracking-wider">
                      Respondent Name
                    </label>
                    <input
  type="text"
  value={formData.RespondentName}
  placeholder="Enter Respondent Name"
  onChange={(e) => {
    const textOnly = e.target.value.replace(/[^a-zA-Z\s.,]/g, ""); // ✅ Allow letters, spaces, dots, commas
    setFormData((prev: any) => ({
      ...prev,
      RespondentName: textOnly.toUpperCase(), // ✅ Convert to uppercase
    }));
  }}
  className="text-black dark:text-white border-[0.5px] bg-transparent p-2 rounded"
/>

                  </div>

                  <div className="flex flex-col mt-4">
                    <label className="italic text-black dark:text-white tracking-wider">
                      Respondent Contact Number
                    </label>
                    <input
  type="text"
  value={formData.RespondentNumber}
  placeholder="Enter Contact Number"
  maxLength={11} // ✅ Limits to 11 characters
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // ✅ Allow only digits
    if (value.length <= 11) { // ✅ Additional safeguard
      setFormData((prev: any) => ({
        ...prev,
        RespondentNumber: value,
      }));
    }
  }}
  className="text-black dark:text-white  border-[0.5px] bg-transparent p-2 rounded"
/>
                  </div>
                </>
              )}

              {formData.RespondentName.trim() !== "" &&
                formData.RespondentNumber.trim() !== "" && (
                  <button
                    onClick={handleSaveData}
                    className="px-4 py-2 w-full bg-blue-500 hover:bg-blue-800 transition text-white rounded"
                  >
                    SUBMIT DATA
                  </button>
                )}

              <button
                onClick={() => {
                  setOpenvalidationmodal(false);
                  setValid(false);
                  setFormData((prev: any) => ({
                    ...prev,
                    RespondentName: "",
                    RespondentSignature: "",
                  }));
                }}
                className="px-4 py-2 w-full bg-red-500 hover:bg-red-800 transition text-white rounded"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationModal;