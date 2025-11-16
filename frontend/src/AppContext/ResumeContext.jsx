// src/context/ResumeContext.js
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
// 1️⃣ Create the context
const ResumeContext = createContext();

// 2️⃣ Provider component
export const ResumeProvider = ({ children }) => {
   const [resumeId, setResumeId] = useState(null);
const setCurrentResumeId = (id) => setResumeId(id);

  const [resumeTemplate, setResumeTemplate] = useState({
    
  personalDetails: {},
  education: {
    isVisible: false,
    entries: []
  },
  experiences: {
      isVisible: false,
      entries: []
    },
    projects: {
      isVisible: false,
      entries: []
    },
    achievements: {
      
      isVisible: false,
      entries: []
    },
    organizations: {
      isVisible: false,
      entries: []
    },
    interests:{
      isVisible: false,
      entries: []
    },
    courses:{
      isVisible: false,
      entries: []
    },
    skills: 
      {
      isVisible: false,
      entries: []
      }
    ,
    languages: [],
    publications: {
      isVisible: false,
       entries: []
    },
    certifications: {
      isVisible: false,
      entries: []
    },
 
  });

  // 3️⃣ Function to update a specific section
  const updateSection = (sectionName, data) => {
    setResumeTemplate((prev) => ({
      ...prev,
      [sectionName]: data,
    }));
  };

  // 4️⃣ Function to reset everything (optional)
  const resetResume = () => {
    setResumeTemplate({
  personalDetails: {},
  education: {
    isVisible: false,
    entries: []
  },
  experiences: {
      isVisible: false,
      entries: []
    },
    projects: {
      isVisible: false,
      entries: []
    },
    achievements: {
      
      isVisible: false,
      entries: []
    },
    organizations: {
      isVisible: false,
      entries: []
    },
    interests:{
      isVisible: false,
      entries: []
    },
    courses:{
      isVisible: false,
      entries: []
    },
    skills: 
      {
      isVisible: false,
      entries: []
      }
    ,
    languages: [],
    publications: {
      isVisible: false,
       entries: []
    },
    certifications: {
      isVisible: false,
      entries: []
    },
    });
  };
const { getToken, userId } = useAuth();
 
  //to save or update a resume
  const handleSaveResume = async () => {
    console.log(resumeId);
  try {
    if (!resumeId) {
      console.error("❌ No resume ID found in URL!");
      return;
    }

    const token = await getToken();
    await axios.put(
      `http://localhost:5000/api/resumes/${resumeId}`,
      { resumeData: resumeTemplate },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(" Resume saved successfully!");
  } catch (err) {
    console.error(" Error saving resume:", err);
  }
};
//load the resume
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadResume = async () => {
    if (!resumeId) return; // wait until resumeId is available
    setIsLoading(true); // ✅ mark start

    try {
      const token = await getToken();
      const res = await axios.get(`http://localhost:5000/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.resumeData) {
        setResumeTemplate(res.data.resumeData);
        console.log("✅ Resume data loaded successfully!");
      } else {
        console.warn("⚠️ No resume data found for this ID.");
      }
    } catch (err) {
      console.error("❌ Error loading resume:", err);
    } finally {
      setIsLoading(false); // ✅ mark end
    }
  };

  loadResume();
}, [resumeId]);



  return (
    <ResumeContext.Provider value={{ resumeTemplate, updateSection, resetResume,handleSaveResume ,setCurrentResumeId, isLoading}}>
      {children}
    </ResumeContext.Provider>
  );
};

// 5️⃣ Custom hook for easy access
export const useResume = () => useContext(ResumeContext);
