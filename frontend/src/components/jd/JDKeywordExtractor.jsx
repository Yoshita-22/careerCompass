
import React, { useState } from "react";
import KeywordChip from "./KeywordChip";

export default function JDExtractorPage() {
  const [jdText, setJdText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtract = async () => {
    setError("");
    setLoading(true);
    setKeywords([]);

    try {
      const res = await fetch("http://localhost:5000/api/extract-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdText }),
      });

      if (!res.ok) throw new Error("Failed to fetch keywords");

      const data = await res.json();
      setKeywords(data.keywords || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while extracting keywords.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
           JD → Keyword Extractor
        </h1>

        {/* JD Input */}
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the Job Description here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
        />

        {/* Extract Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleExtract}
            disabled={loading || !jdText.trim()}
            className={`px-6 py-2.5 font-semibold text-white rounded-full transition-all duration-300 shadow-md ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            {loading ? "Extracting..." : "Extract Keywords"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Result Section */}
        {!loading && keywords.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Extracted Keywords
            </h2>

            {/* Group by category */}
            {Object.entries(
              keywords.reduce((acc, kw) => {
                const cat = kw.category || "Other";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(kw);
                return acc;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="font-semibold text-lg text-gray-700 mb-2 capitalize">
                  {category.replace("_", " ")}
                </h3>
                <div className="flex flex-wrap">
                  {items.map((kw, i) => (
                    <KeywordChip key={i} {...kw} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && keywords.length === 0 && jdText.trim() && !error && (
          <p className="text-gray-500 text-center mt-6 italic">
            No keywords extracted yet.
          </p>
        )}
      </div>
    </div>
  );
}
