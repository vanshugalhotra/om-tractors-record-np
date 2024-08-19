// components/Navbar/Navbar.js
import React from "react";
import { FiMenu } from "react-icons/fi";
import { useSidebar } from "@/context/SidebarContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"], // Use bold weight for the heading
});

const Navbar = () => {
  const { toggleSideBar, marginForSidebar } = useSidebar();

  return (
    <nav
      className="border-b-2 border-gray-200 border-opacity-60 flex py-4 justify-around"
      style={{ marginLeft: marginForSidebar }}
    >
      {/* menu icon */}
      <div
        className="menu-icon p-1 md:hidden inline-block relative self-center"
        onClick={toggleSideBar}
      >
        <FiMenu className="h-8 w-8" />
      </div>
      <div
        className={`heading uppercase lg:text-5xl text-3xl font-medium self-center ${poppins.className}`}
      >
        Om Tractors
      </div>
    </nav>
  );
};

export default Navbar;
