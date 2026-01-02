"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LikedVideo() {
  const [likedVideo, setLikedVideo] = useState([]);

  useEffect(() => {
    const getLikedVideo = async () => {
      try {
        const res = await axios.get("/api/all-like-video");
        if (res) {
          console.log(res.data.data[0].video);
          setLikedVideo(res.data.data);
        }
      } catch (error) {
        console.error(error?.data);
      }
    };
    getLikedVideo();
  }, []);

  if (!likedVideo) return null;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold">Liked video</h1>
        </div>

        {/* Empty State */}
        {likedVideo.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-sm">No liked video yet</p>
            <span className="text-2xl mt-2">📭</span>
          </div>
        )}

        {/* History List */}
        <div className="flex flex-col gap-4">
          {likedVideo.map((like, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.01 }}
              className="flex gap-3 bg-white rounded-xl p-3 shadow-sm cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={like.video.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-sm font-medium line-clamp-2">
                    {like.video.title}
                  </h2>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {like.video.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
