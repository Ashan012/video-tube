"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ListOfSubscriber() {
  const [subscribers, setSubscriber] = useState([]);

  useEffect(() => {
    const getListOfSubscriber = async () => {
      try {
        const res = await axios.get("/api/list-of-subscribers");
        if (res) {
          setSubscriber(res.data.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getListOfSubscriber();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-5">
        {/* Header */}
        <h1 className="text-lg font-semibold mb-4">
          Subscribers ({subscribers.length})
        </h1>

        {/* Empty State */}
        {subscribers.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <p className="text-sm">No subscribers yet</p>
            <span className="text-2xl mt-2">👥</span>
          </div>
        )}

        {/* Subscriber List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subscribers.map((sub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm cursor-pointer"
            >
              {/* Avatar */}
              <img
                src={sub.subscriber.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  {sub.subscriber.fullName}
                </h3>
                <p className="text-xs text-gray-500">
                  Subscribed to your channel
                </p>
              </div>

              {/* Action (optional future) */}
              <button className="text-xs px-3 py-1 rounded-full border hover:bg-gray-100">
                View
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
