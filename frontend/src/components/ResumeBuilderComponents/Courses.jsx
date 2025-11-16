import { useFieldArray, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Plus,
  X,
  Calendar,
  MapPin,
  BookOpen,
  Building2,
  FileText,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MyTextEditor from "./TextEditor";
import SaveBtn from "./SaveBtn";
import { useResume } from "../../AppContext/ResumeContext";
import { useResumeStore } from "../../store/resumeStore";

const schema = yup.object().shape({
  courses: yup.array().of(
    yup.object().shape({
      courseTitle: yup.string().required("Course title is required"),
      institution: yup.string().required("Institution / Platform is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().required("End date is required"),
      location: yup.string().required("Location is required"),
      description: yup.string().max(500, "Max 500 characters allowed"),
    })
  ),
});

export default function CoursesForm() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      courses: [
        {
          courseTitle: "",
          institution: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const { updateSection,handleSaveResume } = useResume();
  const { addCompletedSection, removeCompletedSection, setActiveSection } =
    useResumeStore();
  const navigate = useNavigate();

  const watchCourses = watch("courses", []);

  // ✅ Live preview
  useEffect(() => {
    if (!watchCourses || watchCourses.length === 0) return;

    updateSection("courses", {
      isVisible: true,
      entries: JSON.parse(JSON.stringify(watchCourses)),
    });
  }, [JSON.stringify(watchCourses)]);

  // ✅ Save handler
  const onSubmit = async(data) => {
    updateSection("courses", {
      isVisible: true,
      entries: [...data.courses],
    });

    addCompletedSection({
      id: "courses",
      title: "Courses",
      icon: BookOpen,
    });

    console.log("✅ Courses Saved:", data);

    navigate(-1); // Go back to main builder or parent section

    setActiveSection(null);
    await handleSaveResume();
  };

  // ✅ Delete Section
  const handleDeleteSection = () => {
    updateSection("courses", {
      isVisible: false,
      entries: [],
    });

    removeCompletedSection("courses");
    console.log("🗑️ Courses section deleted");

    
  };

  // ✅ Back button logic
  const handleBack = () => {
    navigate(-1); // Go back in browser history
    // or use: navigate("/resume");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 transition-all duration-300 relative"
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
            <BookOpen className="text-indigo-500 w-6 h-6" /> Courses
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

      {/* Course Fields */}
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Course {index + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Course Title */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Course Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                name={`courses.${index}.courseTitle`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Advanced React & Next.js"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Institution */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Institution / Platform
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Controller
                name={`courses.${index}.institution`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Coursera / IIT Bombay"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              />
            </div>
          </div>

          {/* Dates & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Start Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`courses.${index}.startDate`}
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

            {/* End Date */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`courses.${index}.endDate`}
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

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <Controller
                  name={`courses.${index}.location`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. Online / Mumbai, India"
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
              Description
            </label>
            <MyTextEditor name={`courses.${index}.description`} control={control} />
          </div>
        </div>
      ))}

      {/* Add Course */}
      <button
        type="button"
        onClick={() =>
          append({
            courseTitle: "",
            institution: "",
            startDate: "",
            endDate: "",
            location: "",
            description: "",
          })
        }
        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full flex items-center gap-2 shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
      >
        <Plus size={18} /> Add Another Course
      </button>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <SaveBtn />
      </div>
    </form>
  );
}
