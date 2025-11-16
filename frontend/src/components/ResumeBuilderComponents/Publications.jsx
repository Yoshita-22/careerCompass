import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  BookOpen,
  Calendar,
  FileText,
  Plus,
  X,
  Building2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const publicationSchema = yup.object().shape({
  publications: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      publisher: yup.string().required("Publisher / Journal is required"),
      date: yup.string().required("Date is required"),
      description: yup.string().required("Description is required"),
    })
  ),
});

export default function PublicationsForm() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(publicationSchema),
    defaultValues: {
      publications: [{ title: "", publisher: "", date: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "publications",
  });

  const { updateSection,handleSaveResume } = useResume();
  const {
    addCompletedSection,
    removeCompletedSection,
    setActiveSection,
  } = useResumeStore();

  const watchPublications = watch("publications");

  // ✅ Real-time update for resume preview
  useEffect(() => {
    if (!watchPublications || watchPublications.length === 0) return;

    updateSection("publications", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchPublications)),
    });
  }, [JSON.stringify(watchPublications)]);

  // ✅ Save Handler
  const onSubmit = async(data) => {
    updateSection("publications", {
      isVisible: true,
      entries: [...data.publications],
    });

    addCompletedSection({
      id: "publications",
      title: "Publications",
      icon: FileText,
    });

    setActiveSection(null);
    console.log("✅ Publications Saved:", data);
    await handleSaveResume();
  };

  // ✅ Delete Handler
  const handleDeleteSection = () => {
    updateSection("publications", { isVisible: false, entries: [] });
    removeCompletedSection("publications");
    setActiveSection(null);
    console.log("🗑️ Publications section deleted");
  };

  // ✅ Back Handler
  const handleBack = () => {
    navigate(-1);
    console.log("⬅️ Navigated back");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
    >
      {/* ===== HEADER ===== */}
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
            <BookOpen className="text-indigo-500 w-6 h-6" />
            Publications
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

      {/* ===== FORM BODY ===== */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 hover:shadow-md transition-all duration-300 relative"
        >
          {/* Remove publication */}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-gray-500 hover:text-rose-600 transition-all"
            >
              <X size={18} />
            </button>
          )}

          {/* Title */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Title
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`publications.${index}.title`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Deep Learning in Medical Imaging"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors.publications?.[index]?.title
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors.publications?.[index]?.title && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.publications[index].title.message}
              </p>
            )}
          </div>

          {/* Publisher */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Publisher / Journal
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`publications.${index}.publisher`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. IEEE, Springer, Elsevier"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors.publications?.[index]?.publisher
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors.publications?.[index]?.publisher && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.publications[index].publisher.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Date of Publication
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`publications.${index}.date`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="month"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors.publications?.[index]?.date
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors.publications?.[index]?.date && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.publications[index].date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description / Abstract
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <div className="pl-9">
                <MyTextEditor
                  name={`publications.${index}.description`}
                  control={control}
                  error={errors.publications?.[index]?.description}
                />
              </div>
            </div>
            {errors.publications?.[index]?.description && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.publications[index].description.message}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add New Publication */}
      <button
        type="button"
        onClick={() =>
          append({ title: "", publisher: "", date: "", description: "" })
        }
        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 
                   text-white font-semibold rounded-full flex items-center gap-2 shadow-md 
                   hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
      >
        <Plus size={18} /> Add Another Publication
      </button>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <SaveBtn />
      </div>
    </form>
  );
}
