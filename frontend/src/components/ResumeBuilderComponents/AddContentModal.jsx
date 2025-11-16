import React from "react";
import {
  User,
  School,
  Briefcase,
  Code,
  Award,
  BookOpen,
  Globe2,
  FolderKanban,
  Star,
  Building2,
  BadgeCheck,
  Heart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom"; // Import useParams

export default function AddContentModal({ isOpen, onClose }) {
  const { id } = useParams(); // Extract resume ID from current URL

  if (!isOpen) return null;

  const SECTIONS = [
    { key: "personalDetails", title: "Personal Details", icon: <User className="w-8 h-8 text-indigo-500" />, desc: "Your contact info & professional title." },
    { key: "education", title: "Education", icon: <School className="w-8 h-8 text-indigo-500" />, desc: "Degrees, schools, and academic details." },
    { key: "skills", title: "Skills", icon: <Star className="w-8 h-8 text-indigo-500" />, desc: "Technical and soft skills." },
    { key: "projects", title: "Projects", icon: <FolderKanban className="w-8 h-8 text-indigo-500" />, desc: "Your best academic & personal work." },
    { key: "experience", title: "Experience", icon: <Briefcase className="w-8 h-8 text-indigo-500" />, desc: "Internships and job experience." },
    { key: "certificates", title: "Certificates", icon: <BadgeCheck className="w-8 h-8 text-indigo-500" />, desc: "Courses and verified credentials." },
    { key: "achievements", title: "Achievements", icon: <Award className="w-8 h-8 text-indigo-500" />, desc: "Awards and personal accomplishments." },
    { key: "publications", title: "Publications", icon: <BookOpen className="w-8 h-8 text-indigo-500" />, desc: "Research work & published articles." },
    { key: "languages", title: "Languages", icon: <Globe2 className="w-8 h-8 text-indigo-500" />, desc: "Spoken languages & proficiency." },
    { key: "organizations", title: "Organizations", icon: <Building2 className="w-8 h-8 text-indigo-500" />, desc: "Clubs, communities, leadership roles." },
    { key: "courses", title: "Courses", icon: <BookOpen className="w-8 h-8 text-indigo-500" />, desc: "Short-term courses & certifications." },
    { key: "interests", title: "Interests", icon: <Heart className="w-8 h-8 text-indigo-500" />, desc: "Your hobbies & passions." },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[70%] lg:w-[60%] p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Content</h2>
        <p className="text-gray-600 mb-6">Choose a section to add to your resume</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SECTIONS.map((item) => (
            <Link
              key={item.key}
              to={`/resume/content/${id}/${item.key}`} //  Dynamic route with current resume ID
              onClick={onClose}
              className="flex"
            >
              <div
                className="flex flex-col justify-center items-center text-center 
                border rounded-xl p-5 shadow-sm hover:shadow-md 
                hover:scale-[1.03] transition-all duration-200 
                bg-white w-full h-40"
              >
                {item.icon}
                <h3 className="font-semibold mt-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
