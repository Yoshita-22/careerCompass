import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Globe,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useResume } from "../../AppContext/ResumeContext";
import SaveBtn from "./SaveBtn";
import MyTextEditor from "./TextEditor";
import { useEffect } from "react";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";

// ✅ Validation schema using Yup
const schema = yup.object().shape({
  languages: yup.array().of(
    yup.object().shape({
      language: yup.string().required("Language is required"),
      languageLevel: yup.string().required("Select a proficiency level"),
      additionalInfo: yup.string().nullable(),
    })
  ),
});

export default function LanguagesForm() {
  const navigate = useNavigate(); // ✅ For navigation

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      languages: [
        { language: "", languageLevel: "BASIC", additionalInfo: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  const watchLanguages = watch("languages", []);
  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();

  // ✅ Live Preview Sync
  useEffect(() => {
    if (!watchLanguages || watchLanguages.length === 0) return;
    updateSection("languages", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchLanguages)),
    });
  }, [JSON.stringify(watchLanguages)]);

  // ✅ Save Handler
  const onSubmit = async(data) => {
    updateSection("languages", {
      isVisible: true,
      entries: [...data.languages],
    });

    addCompletedSection({
      id: "languages",
      title: "Languages",
      icon: Globe,
    });

    setActiveSection(null);
    console.log("🌐 Languages Data Saved:", data);
    await handleSaveResume();
  };

  // ✅ Delete Handler
  const handleDeleteSection = () => {
    updateSection("languages", {
      isVisible: false,
      entries: [],
    });
    removeCompletedSection("languages");
    setActiveSection(null);
    console.log("🗑️ Languages section deleted");
  };

  // ✅ Back Handler (navigate -1)
  const handleBack = () => {
    navigate(-1);
    console.log("⬅️ Navigated back to previous page");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
    >
      {/* Header Section */}
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
            <Globe className="text-blue-500 w-6 h-6" /> Languages
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

      {/* Languages Fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-300 relative"
        >
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 transition-all"
            >
              <X size={18} />
            </button>
          )}

          {/* Language Input */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Language
            </label>
            <Controller
              name={`languages.${index}.language`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="e.g. English, Hindi, Japanese..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.languages?.[index]?.language
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors.languages?.[index]?.language && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.languages[index].language.message}
              </p>
            )}
          </div>

          {/* Proficiency Level */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Proficiency Level
            </label>
            <Controller
              name={`languages.${index}.languageLevel`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="BASIC">Basic</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="FLUENT">Fluent</option>
                  <option value="NATIVE">Native</option>
                </select>
              )}
            />
          </div>

          {/* Additional Info */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Additional Info (Optional)
            </label>
            <MyTextEditor
              name={`languages.${index}.additionalInfo`}
              control={control}
              error={errors.languages?.[index]?.additionalInfo}
            />
          </div>
        </div>
      ))}

      {/* Add Button & Save */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() =>
            append({
              language: "",
              languageLevel: "BASIC",
              additionalInfo: "",
            })
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all duration-300"
        >
          <Plus size={18} />
          Add Another Language
        </button>

        <SaveBtn />
      </div>
    </form>
  );
}
