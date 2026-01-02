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
          setWatchHistory(res.data.data.watchHistory);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getWatchHistory();
  }, []);

  const deleteHistory = (id) => {};
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold">Watch History</h1>

          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 rounded-full border hover:bg-gray-100">
              Pause history
            </button>
            <button className="text-xs px-3 py-1 rounded-full border text-red-500 hover:bg-red-50">
              Clear all
            </button>
          </div>
        </div>

        {/* Empty State */}
        {watchHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-sm">No watch history yet</p>
            <span className="text-2xl mt-2">📭</span>
          </div>
        )}

        {/* History List */}
        <div className="flex flex-col gap-4">
          {watchHistory.map((history, i) => (
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
                  src={history.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-sm font-medium line-clamp-2">
                    {history.title}
                  </h2>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {history.description}
                  </p>
                </div>

                <p className="text-[11px] text-gray-400 mt-2">
                  Watched recently
                </p>
              </div>

              <div onClick={() => deleteHistory(history._id)}>X</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
