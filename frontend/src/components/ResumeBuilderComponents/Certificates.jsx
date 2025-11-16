import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Award,
  Plus,
  X,
  Calendar,
  Link as LinkIcon,
  FileText,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";

// ✅ Validation Schema
const certificateSchema = yup.object().shape({
  certifications: yup.array().of(
    yup.object().shape({
      certificateName: yup.string().required("Certificate Name is required"),
      issuingOrganization: yup
        .string()
        .required("Issuing Organization is required"),
      issueDate: yup.string().required("Issue Date is required"),
      credentialURL: yup
        .string()
        .url("Invalid URL")
        .required("Credential URL is required"),
      additionalInfo: yup.string(),
    })
  ),
});

export default function CertificatesSection() {
  const { updateSection,handleSaveResume } = useResume();
  const { setActiveSection } = useResumeStore();
  const navigate = useNavigate(); // ✅ React Router navigation hook

  // ✅ React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(certificateSchema),
    defaultValues: {
      certifications: [
        {
          certificateName: "",
          issuingOrganization: "",
          issueDate: "",
          credentialURL: "",
          additionalInfo: "",
        },
      ],
    },
  });

  // ✅ Dynamic Fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  const watchCertificates = watch("certifications", []);

  // ✅ Live Preview
  useEffect(() => {
    if (!watchCertificates || watchCertificates.length === 0) return;

    updateSection("certifications", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchCertificates)),
    });
  }, [JSON.stringify(watchCertificates)]);

  // ✅ Save
  const onSubmit = async(data) => {
    updateSection("certifications", {
      isVisible: true,
      entries: [...data.certifications],
    });
    console.log("✅ Certificates saved:", data);

    setActiveSection(null);
    navigate(-1); // ✅ redirect to main builder view or specific route

    await handleSaveResume();

  };

  // ✅ Delete Section
  const handleDeleteSection = () => {
    updateSection("certifications", {
      isVisible: false,
      entries: [],
    });
    console.log("🗑️ Certificates section deleted");

    setActiveSection(null);
    navigate("/resume"); // ✅ redirect after delete
  };

  // ✅ Back Navigation
  const handleBack = () => {
    // Option 1: Go back in history
    navigate(-1);

    // Option 2 (optional): navigate to a fixed route instead
    // navigate("/resume");
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
            title="Go Back"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-indigo-500 w-6 h-6" /> Certificates
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

      {/* Certificates Form */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 shadow-sm bg-gray-50 relative"
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

          {/* ✅ Certificate Name */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Certificate Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`certifications.${index}.certificateName`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. AWS Cloud Practitioner"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
            </div>
            {errors.certifications?.[index]?.certificateName && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.certifications[index].certificateName.message}
              </p>
            )}
          </div>

          {/* ✅ Issuing Organization */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Issuing Organization
            </label>
            <Controller
              control={control}
              name={`certifications.${index}.issuingOrganization`}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
              )}
            />
            {errors.certifications?.[index]?.issuingOrganization && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.certifications[index].issuingOrganization.message}
              </p>
            )}
          </div>

          {/* ✅ Issue Date */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Issue Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`certifications.${index}.issueDate`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
            </div>
            {errors.certifications?.[index]?.issueDate && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.certifications[index].issueDate.message}
              </p>
            )}
          </div>

          {/* ✅ Credential URL */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Credential URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                control={control}
                name={`certifications.${index}.credentialURL`}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder="https://example.com/certificate"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
            </div>
            {errors.certifications?.[index]?.credentialURL && (
              <p className="text-rose-500 text-sm mt-1">
                {errors.certifications[index].credentialURL.message}
              </p>
            )}
          </div>

          {/* ✅ Additional Info */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Additional Info
            </label>
            <MyTextEditor
              name={`certifications.${index}.additionalInfo`}
              control={control}
              error={errors.certifications?.[index]?.additionalInfo}
            />
          </div>
        </div>
      ))}

      {/* ✅ Add + Save Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-4">
        <button
          type="button"
          onClick={() =>
            append({
              certificateName: "",
              issuingOrganization: "",
              issueDate: "",
              credentialURL: "",
              additionalInfo: "",
            })
          }
          className="px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
        >
          <Plus size={16} /> Add Another Certificate
        </button>

        <SaveBtn />
      </div>
    </form>
  );
}
