// PersonalDetailsForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  X,
} from "lucide-react";

import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";

import { useResume } from "../../AppContext/ResumeContext"; // your context hook
import { useResumeStore } from "../../store/resumeStore"; // optional store for completed sections

// --- validation schema (same as yours) ---
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  professionalTitle: yup.string().required("Professional title is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  location: yup.string().required("Location is required"),
  summary: yup.string().max(300, "Summary should be under 300 characters"),
  linkedin: yup.string().url("Invalid LinkedIn URL").nullable(),
  github: yup.string().url("Invalid GitHub URL").nullable(),
  portfolio: yup.string().url("Invalid portfolio URL").nullable(),
});

export default function PersonalDetailsForm() {
  const [showLinks, setShowLinks] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
  });

  const { updateSection,handleSaveResume } = useResume(); // updates context.resumeTemplate
  const { addCompletedSection, setActiveSection } = useResumeStore(); // optional: list of completed sections

  // watch all fields
  const watched = watch();

  // previous snapshot to compare and avoid redundant updates
  const prevSnapshotRef = useRef(null);

  // debounce timer ref
  const debounceTimerRef = useRef(null);

  // --- Auto-sync (debounced) to resume context ---
  useEffect(() => {
    // clear existing debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // debounce 300ms after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      try {
        const snapshot = JSON.stringify(watched || {});

        // if snapshot different from previous (deep-equal via stringify), update context
        if (prevSnapshotRef.current !== snapshot) {
          prevSnapshotRef.current = snapshot;

          updateSection("personalDetails", {
            isVisible: true,
            ...watched,
          });
        }
      } catch (err) {
        // fallback: always update if stringify fails
        updateSection("personalDetails", {
          isVisible: true,
          ...watched,
        });
      }
    }, 300); // adjust debounce ms as you like

    // cleanup on unmount or watched change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched, updateSection]); // updateSection assumed stable from context; include it to satisfy hooks rule

  // --- Save handler (explicit) ---
  const onSubmit = async(data) => {
    // immediate update (no debounce) to ensure saved state stored
    updateSection("personalDetails", {
      isVisible: true,
      ...data,
    });

    // mark as completed in UI stack (optional)
    addCompletedSection({
      id: "personalDetails",
      title: "Personal Details",
      // you used the Lucide icon constructor earlier; pass it here
      icon: User,
      summary: data.fullName ? data.fullName : "Personal details added",
    });

    // collapse the form (your flow: set active null = go back to stacked view)
    setActiveSection(null);
    console.log("Personal details saved:", data);
    await handleSaveResume();
  };

  // optional: we can allow programmatic reset if you need
  // const handleReset = () => {
  //   reset(); // resets to default values
  //   updateSection("personalDetails", { isVisible: false, ...defaultValues });
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="e.g. John Doe"
              {...register("fullName")}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Professional Title */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Professional Title
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer"
            {...register("professionalTitle")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.professionalTitle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.professionalTitle.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              {...register("email")}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              placeholder="e.g. +91 9876543210"
              {...register("phone")}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Location (spans cols) */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="e.g. Bengaluru, India"
              {...register("location")}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Professional Summary
          </label>

          <MyTextEditor name="summary" control={control} error={errors.summary} />

          {errors.summary && (
            <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>
          )}
        </div>
      </div>

      {/* Optional Links */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowLinks(!showLinks)}
          className={`px-5 py-2.5 font-semibold flex items-center gap-2 rounded-full transition-all duration-500
            shadow-md focus:outline-none hover:cursor-pointer
            ${
              showLinks
                ? "bg-gradient-to-r from-rose-500 to-pink-400 text-white hover:from-rose-600 hover:to-pink-500"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
            }`}
        >
          {showLinks ? <X size={16} /> : <Plus size={16} />}
          {showLinks ? "Hide links" : "Show more"}
        </button>

        {showLinks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 transition-all duration-500">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                LinkedIn
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  {...register("linkedin")}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.linkedin && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.linkedin.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                GitHub
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  {...register("github")}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.github && (
                <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Portfolio / Website
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  {...register("portfolio")}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.portfolio && (
                <p className="text-red-500 text-sm mt-1">{errors.portfolio.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end mt-6">
        <SaveBtn />
      </div>
    </form>
  );
}
