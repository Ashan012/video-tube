"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function GetAllvideos() {
  const [video, setVideo] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await axios.get(`/api/get-all-videos`);
        if (response) {
          setVideo(response.data.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllVideos();
  }, []);

  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {video.map((c) => (
          <motion.div
            key={c._id}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
          >
            <div
              onClick={() => router.push(`/v/watch/${c._id}`)}
              className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200"
            >
              <img
                src={c.thumbnail}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </div>

            <div
              onClick={() => router.push(`/u/${c.owner.username}`)}
              className="flex gap-3 mt-3"
            >
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
  );
}

export default GetAllvideos;
