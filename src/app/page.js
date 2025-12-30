"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/customComp/navBar.jsx";
import Sidebar from "@/components/customComp/sidebar";

export default function Home() {
  const [video, setVideo] = useState([]);
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAllVideos = async () => {
      const res = await axios.get("/api/get-all-videos");
      setVideo(res.data.data || []);
    };

    const getCurrentUser = async () => {
      const res = await axios.get("/api/get-current-user");
      setUser(res.data.data.user.email);
    };

    getAllVideos();
    getCurrentUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar username={user} toggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          items={[
            "Home",
            "Liked Videos",
            "History",
            "My Content",
            "Collection",
            "Subscribers",
          ]}
          sidebar={sidebarOpen}
          setSidebar={setSidebarOpen}
        />

        {/* Videos */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {video.map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ scale: 1.03 }}
                onClick={() => router.push(`/v/${c._id}`)}
                className="cursor-pointer"
              >
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={c.thumbnail}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-3 mt-3">
                  <img
                    src={c.owner.avatar}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div className="text-sm">
                    <h4 className="font-medium line-clamp-2">{c.title}</h4>
                    <p className="text-gray-600">{c.owner.fullName}</p>
                    <p className="text-gray-500 text-xs">
                      {c.views} views • 44 minutes ago
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
