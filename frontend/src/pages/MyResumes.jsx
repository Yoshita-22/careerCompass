import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyResumes() {
  const { getToken } = useAuth();
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      const token = await getToken();
      const res = await axios.get("http://localhost:5000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data);
    };
    fetchResumes();
  }, []);

  const handleNewResume = async () => {
    const title = prompt("Enter a title for your new resume:");
    if (!title) return;
    const token = await getToken();
    const res = await axios.post(
      "http://localhost:5000/api/resumes",
      { title, resumeData: {} },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate(`/resume/content/${res.data.resume._id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Resumes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resumes.map((r) => (
          <div
            key={r._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/resume/content/${r._id}`)}
          >
            <h2 className="font-semibold text-lg">{r.title}</h2>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(r.lastUpdated).toLocaleString()}
            </p>
          </div>
        ))}

        <button
          onClick={handleNewResume}
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          <PlusCircle className="w-6 h-6 mb-2" />
          Create New Resume
        </button>
      </div>
    </div>
  );
}
