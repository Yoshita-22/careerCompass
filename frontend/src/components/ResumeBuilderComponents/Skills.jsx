import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Wrench,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const skillsSchema = yup.object().shape({
  skills: yup.array().of(
    yup.object().shape({
      domain: yup.string().required("Domain is required"),
      subSkills: yup
        .array()
        .of(yup.string().required("Sub-skill cannot be empty"))
        .min(1, "At least one sub-skill is required"),
      skillLevel: yup.string().required("Skill level is required"),
      description: yup.string().nullable(),
    })
  ),
});

export default function SkillsDetailsForm() {
  const navigate = useNavigate();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(skillsSchema),
    defaultValues: {
      skills: [
        {
          domain: "",
          subSkills: [],
          skillLevel: "BEGINNER",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const { updateSection ,handleSaveResume} = useResume();
  const {
    addCompletedSection,
    removeCompletedSection,
    setActiveSection,
  } = useResumeStore();

  const watchSkills = watch("skills", []);

  // ✅ Live Resume Preview
  useEffect(() => {
    if (!watchSkills || watchSkills.length === 0) return;
    updateSection("skills", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchSkills)),
    });
  }, [JSON.stringify(watchSkills)]);

  // ✅ Submit Handler
  const onSubmit = async(data) => {
    updateSection("skills", {
      isVisible: true,
      entries: [...data.skills],
    });

    addCompletedSection({
      id: "skills",
      title: "Skills",
      icon: Wrench,
    });

    setActiveSection(null);
    console.log("✅ Skills Submitted:", data);

    await handleSaveResume();
  };

  // ✅ Delete Section
  const handleDeleteSection = () => {
    updateSection("skills", { isVisible: false, entries: [] });
    removeCompletedSection("skills");
    setActiveSection(null);
    console.log("🗑️ Skills section deleted");
  };

  // ✅ Back Navigation
  const handleBack = () => {
    navigate(-1);
    console.log("⬅️ Navigated back");
  };

  // ✅ Add Sub-Skill
  const handleAddSubSkill = (index, value) => {
    if (!value.trim()) return;
    const current = getValues(`skills.${index}.subSkills`) || [];
    setValue(`skills.${index}.subSkills`, [...current, value.trim()]);
  };

  // ✅ Remove Sub-Skill
  const handleRemoveSubSkill = (skillIndex, subIndex) => {
    const current = getValues(`skills.${skillIndex}.subSkills`);
    const updated = current.filter((_, i) => i !== subIndex);
    setValue(`skills.${skillIndex}.subSkills`, updated);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="text-gray-500 hover:text-indigo-500 transition-all"
            title="Go back"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wrench className="text-indigo-500 w-6 h-6" /> Skills
          </h2>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDeleteSection}
          className="text-gray-500 hover:text-rose-500 transition-all"
          title="Delete this section"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Skills List */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 relative bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Remove entire skill group */}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          {/* Domain */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Domain
            </label>
            <Controller
              control={control}
              name={`skills.${index}.domain`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Web Development, Data Science, UI Design..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            />
            {errors.skills?.[index]?.domain && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.skills[index].domain.message}
              </p>
            )}
          </div>

          {/* Sub-Skills */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Sub-Skills
            </label>

            <Controller
              control={control}
              name={`skills.${index}.subSkills`}
              render={({ field }) => (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {field.value.map((sub, subIndex) => (
                      <span
                        key={subIndex}
                        className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm flex items-center gap-2 shadow-sm"
                      >
                        {sub}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-gray-200"
                          onClick={() => handleRemoveSubSkill(index, subIndex)}
                        />
                      </span>
                    ))}
                  </div>

                  <AddSubSkillInput
                    onAdd={(value) => handleAddSubSkill(index, value)}
                  />
                </>
              )}
            />
            {errors.skills?.[index]?.subSkills && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.skills[index].subSkills.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description / Summary
            </label>
            <MyTextEditor
              name={`skills.${index}.description`}
              control={control}
              error={errors.skills?.[index]?.description}
            />
          </div>
        </div>
      ))}

      {/* Add Skill Button */}
      <button
        type="button"
        onClick={() =>
          append({
            domain: "",
            subSkills: [],
            skillLevel: "BEGINNER",
            description: "",
          })
        }
        className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
      >
        <Plus size={16} /> Add Skill
      </button>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <SaveBtn />
      </div>
    </form>
  );
}

// ✅ Subskill Input Component
function AddSubSkillInput({ onAdd }) {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. React, Node.js, Python..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="button"
        onClick={() => {
          onAdd(value);
          setValue("");
        }}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 font-semibold transition-all duration-300"
      >
        Add
      </button>
    </div>
  );
}
