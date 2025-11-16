import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import ResumePreview from "./ResumePreview";
import AddContentButton from "../ResumeBuilderComponents/AddContentButton";
import { useResume } from "../../AppContext/ResumeContext";

// 🧩 Import the new download button
import { DownloadPdf } from "../../pdf/DownloadPdf";
export default function ResumeBuilderLayout() {
  const { resumeTemplate, setCurrentResumeId, isLoading } = useResume();
  const { id } = useParams(); // ✅ Get resume ID from URL

  // ✅ When component mounts or URL changes, store the resumeId in context
  useEffect(() => {
    if (id) {
      setCurrentResumeId(id);
      console.log("🧩 Resume ID set in context:", id);
    } else {
      console.warn("⚠️ No resume ID found in URL");
    }
  }, [id]);

  return (
    <div className="w-full h-screen flex overflow-hidden bg-gray-100">
      {/* LEFT: FORM SECTION */}
      <div className="w-[45%] h-full overflow-y-auto bg-white shadow-lg border-r flex flex-col">
        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

        {/* Centered Add Content Button */}
        <div className="flex justify-center items-center py-6 border-t bg-white">
          <AddContentButton />
        </div>
      </div>

      {/* RIGHT: PREVIEW SECTION */}
      <div className="w-[55%] h-full overflow-y-auto flex flex-col items-center p-6">
        {/*  Download PDF Button above the preview */}
        <div className="self-end mb-4">
          <button
            onClick={DownloadPdf}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Download PDF
          </button>
        </div>


        {/* A4 PAGE PREVIEW */}
        <div
          className="
            bg-white shadow-xl 
            p-10 
            border border-gray-300 
            rounded-sm 
            w-[210mm] 
            min-h-[297mm] 
            print:w-[210mm] 
            print:h-[297mm]
          "
          id = "resume-preview"
        >
          {isLoading ? (
            <div className="text-gray-400 text-center w-full h-full flex items-center justify-center">
              Loading resume preview...
            </div>
          ) : (
            <ResumePreview data={resumeTemplate} />
          )}
        </div>
      </div>
    </div>
  );
}
