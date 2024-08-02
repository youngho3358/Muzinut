"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface HeaderAndSideProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Props를 통해 isSidebarOpen과 toggleSidebar를 받아옴
const HeaderAndSide: React.FC<HeaderAndSideProps> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  return (
    <>
      {/* Navbar와 Sidebar에 props로 전달 */}
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default HeaderAndSide;

// 추가