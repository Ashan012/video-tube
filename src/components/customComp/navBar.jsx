import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function NavBar() {
  const router = useRouter();
  return (
    <header className="w-full h-16 border-b bg-white">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="w-[20%] text-xl font-semibold cursor-pointer">
          VideoTube
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center">
          <div className="w-[60%] flex">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-1 border rounded-l-md outline-none"
            />
            <button className="px-4 border border-l-0 rounded-r-md bg-gray-100">
              🔍
            </button>
          </div>
        </div>

        {/* Right: User */}
        <div>
          <button onClick={() => router.replace("/v/upload-video")}>
            upload video
          </button>
          <button
            onClick={() => signOut()}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
