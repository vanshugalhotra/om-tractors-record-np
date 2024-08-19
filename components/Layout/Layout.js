// components/Layout.js
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import LoginModal from "../Modal/LoginModal";

const Layout = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authenticated") === "true";
    setAuthenticated(isAuthenticated);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar handleLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
