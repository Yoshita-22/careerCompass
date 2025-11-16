import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts and shared wrappers
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/protectedRoute";

// Pages
import HomePage from "./HomePage";
import MyResumes from "./pages/MyResumes";
import CareerCompassLanding from "./pages/LandingPage";

// Resume builder + sections
import PersonalDetailsForm from "./components/ResumeBuilderComponents/PersonalDetails";
import EducationDetailsForm from "./components/ResumeBuilderComponents/Education";
import SkillsDetailsForm from "./components/ResumeBuilderComponents/Skills";
import ProjectsDetailsForm from "./components/ResumeBuilderComponents/Projects";
import CertificatesSection from "./components/ResumeBuilderComponents/Certificates";
import AchievementsSection from "./components/ResumeBuilderComponents/Achievements";
import InterestsForm from "./components/ResumeBuilderComponents/Interests";
import ExperienceForm from "./components/ResumeBuilderComponents/Experience";
import CoursesForm from "./components/ResumeBuilderComponents/Courses";
import OrganizationsForm from "./components/ResumeBuilderComponents/Organisations";
import PublicationsForm from "./components/ResumeBuilderComponents/Publications";
import LanguagesForm from "./components/ResumeBuilderComponents/Languages";
import MyTextEditor from "./components/ResumeBuilderComponents/TextEditor";
import ResumeBuilderLayout from "./components/resumeBuilder/ResumeBuilderLayout";

// Tools
import JDExtractorPage from "./components/jd/JDKeywordExtractor";
import RoadmapGenerator from "./components/roadmap/RoadmapGenerator";

function App() {
  return (
    <Routes>
      {/* 🔓 PUBLIC AUTH ROUTES — must NOT be wrapped in Layout */}
      <Route
  path="/login"
  element={<SignIn routing="path" path="/login" afterSignInUrl="/my-resumes" />}
/>
<Route
  path="/signup"
  element={<SignUp routing="path" path="/signup" afterSignUpUrl="/my-resumes" />}
/>


      {/* 🏠 LANDING PAGE / HOME ROUTE */}
      <Route path="/" element={<CareerCompassLanding />} />

      {/* 🔒 PROTECTED APP ROUTES (Inside Layout) */}
      <Route element={<Layout />}>
        <Route
          path="/my-resumes"
          element={
            <ProtectedRoute>
              <MyResumes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jd-extractor"
          element={
            <ProtectedRoute>
              <JDExtractorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roadmap-generator"
          element={
            <ProtectedRoute>
              <RoadmapGenerator />
            </ProtectedRoute>
          }
        />

        {/* 🧱 Resume Builder Routes */}
        <Route
          path="/resume/content/:id"
          element={
            <ProtectedRoute>
              <ResumeBuilderLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Resume Sections */}
          <Route index element={<PersonalDetailsForm />} />
          <Route path="education" element={<EducationDetailsForm />} />
          <Route path="skills" element={<SkillsDetailsForm />} />
          <Route path="certificates" element={<CertificatesSection />} />
          <Route path="achievements" element={<AchievementsSection />} />
          <Route path="interests" element={<InterestsForm />} />
          <Route path="experience" element={<ExperienceForm />} />
          <Route path="languages" element={<LanguagesForm />} />
          <Route path="course" element={<CoursesForm />} />
          <Route path="projects" element={<ProjectsDetailsForm />} />
          <Route path="organisations" element={<OrganizationsForm />} />
          <Route path="publications" element={<PublicationsForm />} />
          <Route path="editor" element={<MyTextEditor />} />
        </Route>
      </Route>

      {/* 🚫 FALLBACK ROUTE (404 redirect to landing) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
