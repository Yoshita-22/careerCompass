import React, { useEffect } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Link as LinkIcon,
  Calendar,
  FileText,
  FolderGit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";
import { useNavigate } from "react-router-dom";

// ✅ Validation schema
const projectSchema = yup.object().shape({
  projects: yup.array().of(
    yup.object().shape({
      projectTitle: yup.string().required("Project title is required"),
      subTitle: yup.string().required("Subtitle or role is required"),
      projectLink: yup.string().url("Invalid URL").nullable(),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      description: yup.string().required("Description is required"),
    })
  ),
});

export default function ProjectsDetailsForm() {
  const navigate = useNavigate();

  // ✅ React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      projects: [
        {
          projectTitle: "",
          subTitle: "",
          projectLink: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    },
  });

  // ✅ Dynamic project fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  // ✅ Context and store hooks
  const { updateSection,handleSaveResume } = useResume();
  const {
    addCompletedSection,
    removeCompletedSection,
    setActiveSection,
  } = useResumeStore();

  // ✅ Watch for real-time updates
  const watchProjects = watch("projects", []);

  // ✅ Live preview sync
  useEffect(() => {
    if (!watchProjects || watchProjects.length === 0) return;
    updateSection("projects", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchProjects)),
    });
  }, [JSON.stringify(watchProjects)]);

  // ✅ Submit Handler
  const onSubmit = async(data) => {
    updateSection("projects", {
      isVisible: true,
      entries: [...data.projects],
    });

    addCompletedSection({
      id: "projects",
      title: "Projects",
      icon: FolderGit2,
    });

    setActiveSection(null);
    console.log("✅ Projects saved:", data);

    await handleSaveResume();
  };

  // ✅ Delete Handler
  const handleDeleteSection = () => {
    updateSection("projects", { isVisible: false, entries: [] });
    removeCompletedSection("projects");
    setActiveSection(null);
    console.log("🗑️ Deleted Projects section");
  };

  // ✅ Back Handler
  const handleBack = () => {
    navigate(-1);
    console.log("⬅️ Navigated back to previous section");
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
            <FolderGit2 className="w-6 h-6 text-indigo-500" /> Projects
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

      {/* Dynamic Project Fields */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 relative shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Remove project */}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          {/* Project Title */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Project Title
            </label>
            <Controller
              control={control}
              name={`projects.${index}.projectTitle`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Weather Forecast App"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.projects?.[index]?.projectTitle
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors.projects?.[index]?.projectTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].projectTitle.message}
              </p>
            )}
          </div>

          {/* Subtitle */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Subtitle / Role
            </label>
            <Controller
              control={control}
              name={`projects.${index}.subTitle`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Built with React and Firebase"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.projects?.[index]?.subTitle
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors.projects?.[index]?.subTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].subTitle.message}
              </p>
            )}
          </div>

          {/* Project Link */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Project Link (optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`projects.${index}.projectLink`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder="https://github.com/yourproject"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors.projects?.[index]?.projectLink
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors.projects?.[index]?.projectLink && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projects[index].projectLink.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Calendar size={14} /> Start Date
              </label>
              <Controller
                control={control}
                name={`projects.${index}.startDate`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="month"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.projects?.[index]?.startDate
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Calendar size={14} /> End Date
              </label>
              <Controller
                control={control}
                name={`projects.${index}.endDate`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="month"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.projects?.[index]?.endDate
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col mb-2">
            <label className="text-sm font-semibold text-gray-600 mb-1 flex items-center gap-1">
              <FileText size={14} /> Description
            </label>
            <MyTextEditor
              name={`projects.${index}.description`}
              control={control}
              error={errors.projects?.[index]?.description}
            />
          </div>
        </div>
      ))}

      {/* Add / Save Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() =>
            append({
              projectTitle: "",
              subTitle: "",
              projectLink: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
          className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
        >
          <Plus size={16} /> Add Project
        </button>

        <SaveBtn />
      </div>
    </form>
  );
}
