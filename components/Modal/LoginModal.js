// components/LoginModal.js
"use client";

import { raiseToast } from "@/utils/utilityFuncs";
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const hardcodedUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const hardcodedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === hardcodedUsername && password === hardcodedPassword) {
      localStorage.setItem("authenticated", "true");
      raiseToast("success", "Logged in Successfully!!");
      onLogin();
    } else {
      setError("Invalid credentials. Please try again.");
      raiseToast("error", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 md:w-1/2 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <div className="mb-4 flex items-center border border-gray-300 rounded p-2">
          <FaUser className="mr-2" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <div className="mb-4 flex items-center border border-gray-300 rounded p-2">
          <FaLock className="mr-2" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
