"use client";

import { useState } from "react";
import NavBar from "@/components/customComp/navBar.jsx";
import Sidebar from "@/components/customComp/sidebar";
import GetAllvideos from "@/components/customComp/GetAllvideos";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar toggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          items={[
            "Home",
            "Liked Video",
            "History",
            "My Content",
            "Collection",
            "Subscribers",
          ]}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        <GetAllvideos />
      </div>
    </div>
  );
}
