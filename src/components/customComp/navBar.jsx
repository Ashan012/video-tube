"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function NavBar({ toggleSidebar }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get("/api/get-current-user");
        if (response) {
          setLoggedIn(true);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };
    getCurrentUser();
  }, []);

  const findUser = () => {
    if (search == "") {
      return toast.error("write somthing");
    }
    router.push(`/u/${search}`);
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          <div
            onClick={() => router.push("/")}
            className="text-lg font-bold cursor-pointer select-none"
          >
            VideoTube
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="w-[60%] flex">
            <input
              type="text"
              placeholder="Search users"
              className="w-full px-3 py-2 border rounded-l-full outline-none focus:ring-1"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && findUser()}
            />
            <button
              onClick={findUser}
              className="px-4 border border-l-0 rounded-r-full bg-gray-100"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/v/upload-video")}
            className="text-sm px-4 py-1.5 rounded-full bg-black text-white hover:bg-neutral-800"
          >
            Upload
          </button>

          {loggedIn ? (
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="text-sm px-3 py-1.5 border rounded-full hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.replace("/sign-in")}
              className="text-sm px-3 py-1.5 border rounded-full hover:bg-gray-100"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex">
          <input
            type="text"
            placeholder="Search users"
            className="w-full px-3 py-2 border rounded-l-full outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={findUser}
            className="px-4 border border-l-0 rounded-r-full bg-gray-100"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
