"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Trash2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [details, setDetails] = useState({
    like: 0,
    views: 0,
    subscribers: 0,
    video: [],
  });

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard");
        if (res) {
          const data = res.data.data;
          console.log(data);
          setDetails({
            like: data.totalLikes,
            views: data.totalViews,
            subscribers: data.totalSubscribers,
            video: data.videos,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDashboard();
  }, []);

  const deleteVideo = async (videoId) => {
    try {
      const res = await axios.delete(`/api/delete-video?videoId=${videoId}`);
      if (res) {
        setDetails((prev) => ({
          ...prev,
          video: prev.video.filter((v) => v._id !== videoId),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateVideo = (videoId) => {
    router.push(`/v/update-video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 className="text-gray-500 text-sm"> Likes</h3>
          <p className="text-2xl font-bold">{details.like}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 className="text-gray-500 text-sm"> Subscribers</h3>
          <p className="text-2xl font-bold">{details.subscribers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <h3 className="text-gray-500 text-sm"> Views</h3>
          <p className="text-2xl font-bold">{details.views}</p>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Thumbnail
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Views
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Upload Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.video.map((content, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <Switch checked={content.isPublished} />
                  <span className="text-sm">
                    {content.isPublished ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <img
                    src={content.thumbnail}
                    alt="thumbnail"
                    className="w-16 h-10 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {content.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {content.views}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => updateVideo(content._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteVideo(content._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {details.video.length === 0 && (
          <div className="text-center text-gray-500 p-6">
            No videos uploaded yet
          </div>
        )}
      </div>
    </div>
  );
}
