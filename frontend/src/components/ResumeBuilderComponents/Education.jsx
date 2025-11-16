import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Calendar,
  MapPin,
  Book,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";

const educationSchema = yup.object().shape({
  education: yup.array().of(
    yup.object().shape({
      school: yup.string().required("School / University is required"),
      degree: yup.string().required("Degree is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      location: yup.string().required("Location is required"),
      cgpa: yup
        .string()
        .matches(/^[0-9./\s]+$/, "Enter a valid CGPA or Percentage")
        .required("CGPA / Percentage is required"),
      description: yup.string().nullable(),
    })
  ),
});

export default function EducationDetailsForm() {
  
    const navigate = useNavigate(); // ✅ for back navigation
  
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(educationSchema),
    defaultValues: {
      education: [
        {
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          location: "",
          cgpa: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const { updateSection,handleSaveResume } = useResume();
  const {
    addCompletedSection,
    removeCompletedSection,
    setActiveSection,
  } = useResumeStore();

  const watchEducation = watch("education", []);

  // ✅ Update preview on input change
  useEffect(() => {
    if (!watchEducation || watchEducation.length === 0) return;

    updateSection("education", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchEducation)),
    });
  }, [JSON.stringify(watchEducation)]);

  // ✅ Save handler
  const onSubmit = async(data) => {
    updateSection("education", {
      isVisible: true,
      entries: [...data.education],
    });

    // Add to completed sections
    addCompletedSection({
      id: "education",
      title: "Education",
      icon: GraduationCap,
    });

    // Return to stacked view
    setActiveSection(null);

    console.log("🎓 Education data saved:", data);
    await handleSaveResume();
  };

  // ✅ Delete section handler
  const handleDeleteSection = () => {
    updateSection("education", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("education");
    setActiveSection(null);

    console.log("🗑️ Education section deleted");
  };

  // ✅ Back handler (just reset to stacked view, not navigation)
  const handleBack = () => {
    navigate(-1);
    setActiveSection(null);
    console.log("⬅️ Returned to stacked view");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
    >
      {/* Header with Back + Delete */}
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
            <GraduationCap className="w-6 h-6 text-indigo-500" /> Education
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

      {/* Education Fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-5 mb-6 relative shadow-sm hover:shadow-md transition-all duration-300"
        >
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                School / University
              </label>
              <div className="relative">
                <Book className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`education.${index}.school`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="e.g. NIT Trichy"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                />
              </div>
              {errors.education?.[index]?.school && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].school.message}
                </p>
              )}
            </div>

            {/* Degree */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Degree
              </label>
              <Controller
                name={`education.${index}.degree`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              {errors.education?.[index]?.degree && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].degree.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`education.${index}.startDate`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="month"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                />
              </div>
              {errors.education?.[index]?.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].startDate.message}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`education.${index}.endDate`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="month"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                />
              </div>
              {errors.education?.[index]?.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].endDate.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`education.${index}.location`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="e.g. Chennai, India"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                />
              </div>
              {errors.education?.[index]?.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].location.message}
                </p>
              )}
            </div>

            {/* CGPA */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                CGPA / Percentage
              </label>
              <Controller
                name={`education.${index}.cgpa`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="e.g. 9.1 / 10"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              {errors.education?.[index]?.cgpa && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.education[index].cgpa.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Description
              </label>
              <Controller
                name={`education.${index}.description`}
                control={control}
                render={({ field }) => (
                  <MyTextEditor
                    name={field.name}
                    control={control}
                    error={errors.education?.[index]?.description}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() =>
            append({
              school: "",
              degree: "",
              startDate: "",
              endDate: "",
              location: "",
              cgpa: "",
              description: "",
            })
          }
          className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full shadow-md focus:outline-none bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:cursor-pointer"
        >
          <Plus size={16} /> Add Education
        </button>

        <SaveBtn />
      </div>
    </form>
  );
}
