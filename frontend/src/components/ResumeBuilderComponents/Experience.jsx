import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Briefcase,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  ArrowLeft,
  X,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useEffect } from "react";
import { useResumeStore } from "../../store/resumeStore";

// ✅ Validation Schema
const schema = yup.object().shape({
  experiences: yup.array().of(
    yup.object().shape({
      employer: yup.string().required("Employer is required"),
      jobTitle: yup.string().required("Job title is required"),
      employmentType: yup.string().required("Employment type is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      location: yup.string().required("Location is required"),
      description: yup.string().required("Description is required"),
    })
  ),
});

export default function ExperienceForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      experiences: [
        {
          employer: "",
          jobTitle: "",
          employmentType: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  const watchExperience = watch("experiences", []);
  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();

  // ✅ Live Preview Update
  useEffect(() => {
    if (!watchExperience || watchExperience.length === 0) return;

    updateSection("experiences", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchExperience)),
    });
  }, [JSON.stringify(watchExperience)]);

  // ✅ Save Handler
  const onSubmit = async(data) => {
    updateSection("experiences", {
      isVisible: true,
      entries: [...data.experiences],
    });

    addCompletedSection({
      id: "experiences",
      title: "Work Experience",
      icon: Briefcase,
    });

    setActiveSection(null); // Return to stacked view
    console.log("💼 Experience Saved:", data);

    await handleSaveResume();
  };


  // ✅ Delete Section Handler
  const handleDeleteSection = () => {
    updateSection("experiences", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("experiences");
    setActiveSection(null);

    console.log("🗑️ Experience Section Deleted");
  };

  // ✅ Back Button Handler
  const handleBack = () => {
    setActiveSection(null);
    console.log("⬅️ Returned to stacked view");
  };

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
            <Briefcase className="text-indigo-500" /> Work Experience
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

      {/* Experience Fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition-all duration-300 relative"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employer */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Employer / Company
              </label>
              <Controller
                name={`experiences.${index}.employer`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Google, Infosys..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.employer?.message}
              </p>
            </div>

            {/* Job Title */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Job Title
              </label>
              <Controller
                name={`experiences.${index}.jobTitle`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.jobTitle?.message}
              </p>
            </div>

            {/* Employment Type */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Employment Type
              </label>
              <Controller
                name={`experiences.${index}.employmentType`}
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                  </select>
                )}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.employmentType?.message}
              </p>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`experiences.${index}.location`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. Hyderabad, India"
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  )}
                />
              </div>
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.location?.message}
              </p>
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Start Date
              </label>
              <Controller
                name={`experiences.${index}.startDate`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="month"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.startDate?.message}
              </p>
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                End Date
              </label>
              <Controller
                name={`experiences.${index}.endDate`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="month"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.experiences?.[index]?.endDate?.message}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mt-5">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description / Key Responsibilities
            </label>
            <MyTextEditor
              name={`experiences.${index}.description`}
              control={control}
              error={errors.experiences?.[index]?.description}
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.experiences?.[index]?.description?.message}
            </p>
          </div>
        </div>
      ))}

      {/* Add / Save Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() =>
            append({
              employer: "",
              jobTitle: "",
              employmentType: "",
              startDate: "",
              endDate: "",
              location: "",
              description: "",
            })
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all duration-300"
        >
          <Plus size={18} />
          Add Experience
        </button>

        <SaveBtn />
      </div>
    </form>
  );
}
