import React, { useState } from "react";
import { Briefcase, FileText, Sparkles, Route, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { isSignedIn } = useUser();
  const location = useLocation();

  const links = [
    { path: "/my-resumes", label: "Resume Content", icon: <FileText size={18} /> },
    { path: "/jd-extractor", label: "JD → Keyword Generator", icon: <Sparkles size={18} /> },
    { path: "/roadmap-generator", label: "Personalized Roadmap", icon: <Route size={18} /> },
  ];

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-blue-100 shadow-sm z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-2 px-6 h-16 border-b border-blue-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-800">CareerCompass</span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col space-y-1 px-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Link
                to="/login"
                className="px-4 py-2 w-32 text-center text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 w-32 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
