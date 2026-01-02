"use client";

import { useState } from "react";
import NavBar from "@/components/customComp/navBar.jsx";
import Sidebar from "@/components/customComp/sidebar";
import GetAllvideos from "@/components/customComp/GetAllvideos";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <GetAllvideos />
    </div>
  );
}
