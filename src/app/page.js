"use client";
import axios from "axios";
import NavBar from "../components/customComp/navBar.jsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [video, setVideo] = useState([]);
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const res = await axios.get("/api/get-all-videos");
        setVideo(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    const getCurrentUser = async () => {
      try {
        const res = await axios.get("/api/get-current-user");
        setUser(res.data.data.user.email);
      } catch (err) {
        console.error(err);
      }
    };

    getAllVideos();
    getCurrentUser();
  }, []);

  const getVideoById = (id) => {
    router.push(`/v/${id}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar username={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r px-3 py-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2 text-sm">
            {[
              "Home",
              "Liked Videos",
              "History",
              "My Content",
              "Collection",
              "Subscribers",
            ].map((item) => (
              <div
                key={item}
                className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
              Support
            </div>
            <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
              Settings
            </div>
          </div>
        </aside>

        {/* Videos */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-6">
            {video.map((c) => (
              <div
                key={c._id}
                onClick={() => getVideoById(c._id)}
                className="w-72 cursor-pointer hover:scale-[1.02] transition"
              >
                {/* Thumbnail */}
                <div className="w-full h-40 rounded overflow-hidden bg-gray-200">
                  <img
                    src={c.thumbnail}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex gap-3 mt-3">
                  <img
                    src={c.owner.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="text-sm">
                    <h4 className="font-medium line-clamp-2">{c.title}</h4>
                    <p className="text-gray-600">{c.owner.fullName}</p>
                    <p className="text-gray-500 text-xs">
                      {c.views} views • 44 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
