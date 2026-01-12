import React, { useState } from "react";

export default function RoadmapGenerator() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [duration, setDuration] = useState("60 days");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setRoadmap([]);
    try {
      const res = await fetch("http://localhost:5000/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd, resume, duration }),
      });

      const data = await res.json();
      setRoadmap(data.roadmap || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          JD → Resume → AI Roadmap Generator
        </h1>

        <textarea
          placeholder="Paste Job Description here..."
          className="w-full h-32 border p-3 rounded-lg mb-4"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <textarea
          placeholder="Paste your Resume content here..."
          className="w-full h-32 border p-3 rounded-lg mb-4"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <div className="flex gap-3 items-center mb-4">
          <label className="font-semibold">Duration:</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option>30 days</option>
            <option>60 days</option>
            <option>90 days</option>
            <option>6 months</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>

        {roadmap.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">
              Personalized Roadmap
            </h2>
            <div className="space-y-6">
              {roadmap.map((phase, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-1">{phase.week}</h3>
                  <p className="text-indigo-700 font-semibold mb-2">
                     {phase.focus}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-800">
                    {phase.topics?.map((t, j) => <li key={j}>{t}</li>)}
                  </ul>
                  <p className="mt-2 text-sm text-gray-600">
                    Resources: {phase.resources?.join(", ")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700">
                     Goal: {phase.goal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
