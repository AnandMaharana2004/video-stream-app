// src/components/DeletePopup.tsx
"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface DeletePopupProps {
  onClose: () => void;
  onDelete: () => Promise<{status : boolean}>;
  videoTitle: string;
}

const DeletePopup = ({ onClose, onDelete, videoTitle }: DeletePopupProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isConfirmed = confirmText === "delete permanently";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    const result = await onDelete();
    console.log("delet Popup result is :", result)
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000006f] bg-opacity-70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-zinc-800 p-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-zinc-700 pb-4">
          <FaTrash className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-white">
            Confirm Video Deletion
          </h2>
        </div>
        <div className="py-6 text-white">
          <p className="mb-4">
            Are you sure you want to delete the video
            <span className="font-semibold">{videoTitle}</span> This action
            cannot be undone.
          </p>
          <p className="mb-2 text-sm text-gray-400">
            Please type
            <span className="font-mono text-red-400">delete permanently</span>
            to confirm.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white outline-none focus:border-red-500"
            placeholder='Type "delete permanently"'
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-gray-400 transition-colors hover:bg-zinc-700"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className={`rounded-md px-4 py-2 text-white transition-colors ${
              isConfirmed
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;