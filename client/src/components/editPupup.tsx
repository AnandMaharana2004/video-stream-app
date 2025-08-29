// components/EditPopup.tsx
"use client";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface EditPopupProps {
  video: {
    videoID: string;
    status: string;
    thumbnail: string;
  };
  onClose: () => void;
  onSave: (data: { title: string; description: string; isPublic: boolean }) => void;
}

const EditPopup = ({ video, onClose, onSave }: EditPopupProps) => {
  const [title, setTitle] = useState("Default Video Title"); // Replace with real data from your state
  const [description, setDescription] = useState("This is a default video description."); // Replace with real data
  const [isPublic, setIsPublic] = useState(true); // Replace with real data
  const [isSaving, setIsSaving] = useState(false);
  console.log(video)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call to save data
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onSave({ title, description, isPublic });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-6 w-[550px] relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-6">Edit Video Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-2 rounded-md bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-500 bg-zinc-700 rounded border-zinc-600 focus:ring-blue-500"
            />
            <label htmlFor="edit-public" className="text-sm text-gray-300">
              Is Public?
            </label>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-2 rounded-md font-medium transition ${isSaving
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;