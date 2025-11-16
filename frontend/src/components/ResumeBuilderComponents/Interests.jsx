import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Heart, Plus, X, Trash2, ArrowLeft } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SaveBtn from "./SaveBtn";
import MyTextEditor from "./TextEditor";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";
// ✅ Validation Schema
const schema = yup.object().shape({
  interests: yup.array().of(
    yup.object().shape({
      interest: yup.string().required("Interest is required"),
      additionalInfo: yup.string().nullable(),
    })
  ),
});

export default function InterestsSection() {
  
    const navigate = useNavigate(); // ✅ for back navigation
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      interests: [{ interest: "", additionalInfo: "" }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "interests",
  });

  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();

  const watchInterests = watch("interests", []);

  // ✅ Update preview live
  useEffect(() => {
    if (!watchInterests || watchInterests.length === 0) return;

    updateSection("interests", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchInterests)),
    });
  }, [JSON.stringify(watchInterests)]);

  // ✅ Save Handler
  const onSubmit = async(data) => {
    updateSection("interests", {
      isVisible: true,
      entries: [...data.interests],
    });

    addCompletedSection({
      id: "interests",
      title: "Interests",
      icon: Heart,
    });

    setActiveSection(null);
    console.log("❤️ Interests saved:", data);
    await handleSaveResume();
  };

  // ✅ Delete Handler
  const handleDeleteSection = () => {
    updateSection("interests", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("interests");
    setActiveSection(null);
    console.log("🗑️ Interests section deleted");
  };

  // ✅ Back Handler
  const handleBack = () => {
    setActiveSection(null);
    navigate(-1);
    console.log("⬅️ Returned to stacked view");
  };

  // ✅ UI
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* ⬅️ Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="text-gray-500 hover:text-indigo-500 transition-all"
            title="Go back"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="text-yellow-500 w-6 h-6" /> Interests & Hobbies
          </h2>
        </div>

        {/* 🗑️ Delete Button */}
        <button
          type="button"
          onClick={handleDeleteSection}
          className="text-gray-500 hover:text-rose-500 transition-all"
          title="Delete this section"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 relative shadow-sm hover:shadow-md transition-all duration-300"
        >
          {index > 0 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
            >
              <X size={18} />
            </button>
          )}

          {/* Interest */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Interest / Hobby
            </label>
            <Controller
              control={control}
              name={`interests.${index}.interest`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Photography, Reading, Music..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors?.interests?.[index]?.interest
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors?.interests?.[index]?.interest && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.interests[index].interest.message}
              </p>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex flex-col mb-2">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Additional Info (Optional)
            </label>
            <MyTextEditor
              name={`interests.${index}.additionalInfo`}
              control={control}
              error={errors?.interests?.[index]?.additionalInfo}
            />
            {errors?.interests?.[index]?.additionalInfo && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.interests[index].additionalInfo.message}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add Interest */}
      <button
        type="button"
        onClick={() => append({ interest: "", additionalInfo: "" })}
        className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full 
        shadow-md bg-gradient-to-r from-yellow-500 to-orange-400 text-white 
        hover:from-yellow-600 hover:to-orange-500 transition-all duration-300"
      >
        <Plus size={16} /> Add Another Interest
      </button>

      {/* Save */}
      <div className="mt-6 flex justify-end">
        <SaveBtn />
      </div>
    </form>
  );
}
