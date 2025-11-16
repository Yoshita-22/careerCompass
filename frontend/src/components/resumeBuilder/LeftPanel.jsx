import { Plus } from "lucide-react";

export default function LeftPanel({
  completedSections,
  activeSection,
  setActiveSection,
  openAddContentModal,
  renderForm,
}) {
  return (
    <div className="w-full h-full p-6">

      {/* ✅ ADD CONTENT BUTTON */}
     

      {/* ✅ STACKED COMPLETED SECTIONS */}
      <div className="mt-6 space-y-3">
        {completedSections.length === 0 && (
          <p className="text-gray-500 text-sm">No sections added yet.</p>
        )}

        {completedSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="
              w-full p-4 bg-gray-100 hover:bg-gray-200
              flex items-center justify-between rounded-lg shadow-sm
            "
          >
            <div className="flex items-center gap-3">
              <section.icon className="w-5 h-5 text-gray-700" />
              <span className="font-medium">{section.title}</span>
            </div>

            {/* Edit Icon */}
            <span className="text-sm text-blue-600 hover:underline">
              Edit
            </span>
          </button>
        ))}
      </div>

      {/* ✅ ACTIVE FORM SECTION */}
      <div className="mt-6">
        {activeSection ? (
          renderForm(activeSection)
        ) : (
          <p className="text-gray-400 text-sm">
            Select a section to start editing.
          </p>
        )}
      </div>
    </div>
  );
}
