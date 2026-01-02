"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const getWatchHistory = async () => {
      try {
        const res = await axios.get("/api/user-watch-history");
        if (res) {
          console.log(res.data.data.watchHistory);
          setWatchHistory(res.data.data.watchHistory);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getWatchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-lg font-semibold mb-4">Watch History</h1>

        {/* Empty State */}
        {watchHistory.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No watch history yet 📭
          </div>
        )}

        {/* History List */}
        <div className="flex flex-col gap-4">
          {watchHistory.map((history, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex gap-3 bg-white rounded-xl p-3 shadow-sm cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={history.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between">
                <h2 className="text-sm font-medium line-clamp-2">
                  {history.title}
                </h2>

                <p className="text-xs text-gray-500 mt-1">Watched recently</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
