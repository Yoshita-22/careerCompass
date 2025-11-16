import React, { useState } from "react";
import AddContentModal from "./AddContentModal";

export default function AddContentButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (section) => {
    console.log("Selected section:", section);
    setModalOpen(false);

    // navigate or open form for that section
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-indigo-600 text-white p-3 rounded-lg cursor-pointer"
      >
        + Add Content
      </button>

      <AddContentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
