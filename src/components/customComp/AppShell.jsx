"use client";

import { useState } from "react";
import NavBar from "@/components/customComp/navBar";
import Sidebar from "./sidebar";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar toggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          items={[
            "home",
            "liked-video",
            "history",
            "my-content",
            // "collection",
            "subscribers",
          ]}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
