import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ setFormData }) => {
  const sigPad = useRef(null);

  const handleClear = () => {
    sigPad.current.clear(); // ✅ Clear the canvas
    setFormData((prev) => ({
      ...prev,
      RespondentSignature: "",
    }));
  };

  const handleSave = () => {
    if (sigPad.current.isEmpty()) { // ✅ Prevent saving if canvas is empty
      alert("Please provide a signature before saving.");
      return;
    }

    const signatureData = sigPad.current.getTrimmedCanvas().toDataURL(); // ✅ Get signature as Base64
    setFormData((prev) => ({
      ...prev,
      RespondentSignature: signatureData,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl text-black dark:text-white font-bold">Respondent Signature</h2>

      {/* ✅ Signature Canvas */}
      <div className="border-[1px] bg-white">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 300, className: "sigCanvas" }}
          ref={sigPad}
        />
      </div>

      <div className="flex justify-between">
        <button onClick={handleClear} className="bg-red-500 px-3 py-1 rounded-md">
          Clear
        </button>
        <button onClick={handleSave} className="bg-blue-500 px-3 py-1 rounded-md">
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;