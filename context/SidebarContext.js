"use client";

import React, { createContext, useContext, useState } from "react";
import useWindowWidth from "@/hooks/useWindowWidth";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRecordsSubMenu, setShowRecordsSubMenu] = useState(true);
  const [showTypeSubMenu, setShowTypeSubMenu] = useState(false);
  const [showBrandSubMenu, setShowBrandSubMenu] = useState(true);
  const sideBarData = {
    sideBarOpenWidth: "20vw",
    sideBarCloseWidth: "4vw",
    sideBarImage: "/assets/images/background/back.png",
  };
  const windowWidth = useWindowWidth();

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRecordsSubMenu = () => {
    setShowRecordsSubMenu(!showRecordsSubMenu);
  };

  const toggleTypeSubMenu = () => {
    setShowTypeSubMenu(!showTypeSubMenu);
  };

  const toggleBrandSubMenu = () => {
    setShowBrandSubMenu(!showBrandSubMenu);
  };

  const linkClick = () => {
    if (windowWidth < "768") {
      toggleSideBar();
    }
  };

  const marginForSidebar = isSidebarOpen
    ? sideBarData.sideBarOpenWidth
    : sideBarData.sideBarCloseWidth;
  const effectiveMarginForSidebar = windowWidth < 768 ? 0 : marginForSidebar;

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        showRecordsSubMenu,
        showTypeSubMenu,
        toggleTypeSubMenu,
        showBrandSubMenu,
        toggleBrandSubMenu,
        sideBarData,
        windowWidth,
        toggleSideBar,
        toggleRecordsSubMenu,
        linkClick,
        marginForSidebar: effectiveMarginForSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
