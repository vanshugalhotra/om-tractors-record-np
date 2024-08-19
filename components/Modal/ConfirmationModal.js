"use client";

import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmationModal = ({ showModal, setShowModal, onConfirm, message }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 md:w-1/2 lg:w-1/3">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 mr-2" size={24} />
          <h2 className="text-xl font-bold">Confirm Action</h2>
        </div>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              onConfirm();
              setShowModal(false);
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
