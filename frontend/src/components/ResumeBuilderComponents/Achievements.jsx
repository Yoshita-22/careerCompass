import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Trophy,
  Plus,
  X,
  Calendar,
  MapPin,
  FileText,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import SaveBtn from "./SaveBtn";
import MyTextEditor from "./TextEditor";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";

// ✅ Validation Schema
const schema = yup.object().shape({
  achievements: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      issuer: yup.string().required("Issuer is required"),
      date: yup.string().required("Date is required"),
      location: yup.string().required("Location is required"),
      description: yup.string().required("Description is required"),
    })
  ),
});

export default function AchievementsSection() {
  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();

  const navigate = useNavigate(); // ✅ for back navigation

  // ✅ Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      achievements: [
        { title: "", issuer: "", date: "", location: "", description: "" },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  const watchAchievements = watch("achievements", []);

  useEffect(() => {
    if (!watchAchievements || watchAchievements.length === 0) return;
    updateSection("achievements", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchAchievements)),
    });
  }, [JSON.stringify(watchAchievements)]);

  // ✅ Save handler
  const onSubmit =async (data) => {
    updateSection("achievements", {
      isVisible: true,
      entries: [...data.achievements],
    });

    addCompletedSection({
      id: "achievements",
      title: "Achievements",
      icon: Trophy,
    });

    console.log("🏆 Achievements saved:", data);


    //  navigate to previous route (or main resume builder)
    setActiveSection(null);
    
    await handleSaveResume();

  };

  //  Delete Section handler
  const handleDeleteSection = () => {
    updateSection("achievements", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("achievements");
    console.log("🗑️ Achievements section deleted");

   
  };

  // ✅ Back button handler
  const handleBack = () => {
    // Option 1: Go back in browser history
    navigate(-1);

    // Option 2 (if you want a fixed route instead)
    // navigate("/resume");
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
            <Trophy className="text-yellow-500 w-6 h-6" /> Achievements
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

      {/* Achievement Fields */}
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

          {/* Title */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Achievement Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`achievements.${index}.title`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Winner - National Coding Championship"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors?.achievements?.[index]?.title
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors?.achievements?.[index]?.title && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.achievements[index].title.message}
              </p>
            )}
          </div>

          {/* Issuer */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Issued By
            </label>
            <Controller
              control={control}
              name={`achievements.${index}.issuer`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. IIT Bombay / CodeChef"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors?.achievements?.[index]?.issuer
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors?.achievements?.[index]?.issuer && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.achievements[index].issuer.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`achievements.${index}.date`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors?.achievements?.[index]?.date
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors?.achievements?.[index]?.date && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.achievements[index].date.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`achievements.${index}.location`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Bengaluru, India"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors?.achievements?.[index]?.location
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors?.achievements?.[index]?.location && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.achievements[index].location.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description
            </label>
            <MyTextEditor
              name={`achievements.${index}.description`}
              control={control}
              error={errors.achievements?.[index]?.description}
            />
            {errors?.achievements?.[index]?.description && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.achievements[index].description.message}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={() =>
          append({
            title: "",
            issuer: "",
            date: "",
            location: "",
            description: "",
          })
        }
        className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full 
        shadow-md bg-gradient-to-r from-yellow-500 to-orange-400 text-white 
        hover:from-yellow-600 hover:to-orange-500 transition-all duration-300"
      >
        <Plus size={16} /> Add Another Achievement
      </button>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <SaveBtn />
      </div>
    </form>
  );
}
