import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Building2,
  Calendar,
  FileText,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import MyTextEditor from "./TextEditor";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";
import SaveBtn from "./SaveBtn";
import { useNavigate } from "react-router-dom";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  organizations: yup.array().of(
    yup.object().shape({
      orgName: yup.string().required("Organization name is required"),
      position: yup.string().required("Position is required"),
      startDate: yup.string().nullable(),
      endDate: yup.string().nullable(),
      description: yup.string().nullable(),
    })
  ),
});

export default function OrganizationsForm() {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      organizations: [
        {
          orgName: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "organizations",
  });

  const navigate = useNavigate();
  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();

  const watchOrganizations = watch("organizations");

  // ✅ Update resume preview live
  useEffect(() => {
    if (!watchOrganizations || watchOrganizations.length === 0) return;

    updateSection("organizations", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchOrganizations)),
    });
  }, [JSON.stringify(watchOrganizations)]);

  // ✅ On Save
  const onSubmit =async (data) => {
    updateSection("organizations", {
      isVisible: true,
      entries: [...data.organizations],
    });

    addCompletedSection({
      id: "organizations",
      title: "Organizations",
      icon: Building2,
    });

    setActiveSection(null);
    console.log("🏢 Saved Organizations:", data);
    await handleSaveResume();
  };

  // ✅ Delete Section
  const handleDeleteSection = () => {
    updateSection("organizations", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("organizations");
    setActiveSection(null);
    console.log("🗑️ Organizations section deleted");
  };

  // ✅ Back Button
  const handleBack = () => {
    navigate(-1);
    console.log("⬅️ Navigated back");
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
            <Building2 className="text-indigo-500 w-6 h-6" />
            Organizations
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

      {/* Organization Fields */}
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 hover:shadow-md transition-all duration-300 relative"
        >
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
            >
              <X size={18} />
            </button>
          )}

          {/* Organization Name */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Organization Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                name={`organizations.${index}.orgName`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Google, IEEE Student Chapter"
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      errors.organizations?.[index]?.orgName
                        ? "border-rose-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                )}
              />
            </div>
            {errors.organizations?.[index]?.orgName && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.organizations[index].orgName.message}
              </p>
            )}
          </div>

          {/* Position */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Position / Role
            </label>
            <Controller
              name={`organizations.${index}.position`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Event Coordinator, Member, President"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.organizations?.[index]?.position
                      ? "border-rose-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            />
            {errors.organizations?.[index]?.position && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.organizations[index].position.message}
              </p>
            )}
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Start */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`organizations.${index}.startDate`}
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
            </div>

            {/* End */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`organizations.${index}.endDate`}
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
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description / Achievements
            </label>
            <FileText className="text-gray-400 w-4 h-4 mb-1" />
            <Controller
              control={control}
              name={`organizations.${index}.description`}
              render={() => (
                <MyTextEditor
                  name={`organizations.${index}.description`}
                  control={control}
                  error={errors.organizations?.[index]?.description}
                />
              )}
            />
          </div>
        </div>
      ))}

      {/* Add Organization Button */}
      <button
        type="button"
        onClick={() =>
          append({
            orgName: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full flex items-center gap-2 shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
      >
        <Plus size={18} />
        Add Another Organization
      </button>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <SaveBtn />
      </div>
    </form>
  );
}
