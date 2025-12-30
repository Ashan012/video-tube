"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";

export default function NavBar({ username, toggleSidebar }) {
  const router = useRouter();

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Hamburger button mobile */}
        <button
          className="md:hidden flex items-center gap-2"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="text-lg font-bold cursor-pointer"
        >
          VideoTube
        </div>

        {/* Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="w-[60%] flex">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-2 border rounded-l-md outline-none"
            />
            <button className="px-3 border border-l-0 rounded-r-md bg-gray-100">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/v/upload-video")}
            className="text-sm px-3 py-1.5 rounded bg-black text-white"
          >
            Upload
          </button>

          <button
            onClick={() => signOut()}
            className="text-sm px-3 py-1.5 border rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
