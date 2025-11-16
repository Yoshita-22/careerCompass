// src/features/JDExtractor/KeywordChip.jsx
export default function KeywordChip({ text, category, confidence }) {
  const colors = {
    skill: "bg-blue-100 text-blue-800",
    tool: "bg-green-100 text-green-800",
    cert: "bg-yellow-100 text-yellow-800",
    role: "bg-purple-100 text-purple-800",
    soft_skill: "bg-pink-100 text-pink-800",
    education: "bg-orange-100 text-orange-800",
    experience_level: "bg-gray-100 text-gray-800",
    default: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 inline-block shadow-sm ${colors[category] || colors.default}`}
    >
      {text}
      {confidence !== undefined && (
        <span className="ml-1 text-xs opacity-70">({(confidence * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}
