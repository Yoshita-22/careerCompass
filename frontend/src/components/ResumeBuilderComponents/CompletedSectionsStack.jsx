import React from "react";
import { useNavigate } from "react-router-dom";
import { useResumeStore } from "../../store/resumeStore";
import { CheckCircle2 } from "lucide-react";

export default function CompletedSectionsStack() {
  const { completedSections, setActiveSection } = useResumeStore();
  const navigate = useNavigate();

  if (!completedSections || completedSections.length === 0) {
    return (
      <div className="text-gray-500 italic text-sm text-center">
        No completed sections yet. Add your first section!
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md flex flex-col gap-4">
      {completedSections.map((section, index) => (
        <div
          key={section.id}
          onClick={() => {
            setActiveSection(section.id);
            navigate(`/resume/content/${section.id}`);
          }}
          className={`
            cursor-pointer
            group
            bg-white border border-gray-200
            rounded-xl p-4 shadow-sm 
            hover:shadow-md hover:border-indigo-400 
            transition-all duration-300 
            flex items-center gap-3
            relative
          `}
          style={{
            transform: `translateY(${index * -20}px)`,
            zIndex: completedSections.length - index,
          }}
        >
          {/* Left Icon */}
          {section.icon && (
            <section.icon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
          )}

          {/* Section Title */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{section.title}</h3>
            <p className="text-xs text-gray-500">
              Click to edit this section
            </p>
          </div>

          {/* Completion Checkmark */}
          <CheckCircle2 className="w-5 h-5 text-green-500 opacity-90" />
        </div>
      ))}
    </div>
  );
}
