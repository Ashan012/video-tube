"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserChannelProfile() {
  const { username } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    username: "",
    avatar: null,
    coverImage: null,
    subscribers: 0,
    isSubcribed: false,
    userVideo: [],
    ownerId: "",
  });

  useEffect(() => {
    if (!username) return;

    const getProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/get-user-channel-profile?username=${username}`
        );

        if (res.data) {
          const d = res.data.data;
          console.log(d);

          setData({
            fullName: d.fullName,
            username: d.username,
            avatar: d.avatar,
            coverImage: d.coverImage || null,
            subscribers: d.totalSubscribers,
            isSubcribed: d.isSubcribed,
            userVideo: d.userVideo || [],
            ownerId: d._id,
          });
        }
      } catch (err) {
        console.error(err.response?.data);
        console.error(err.response?.data?.message);
        if (err.response?.data) {
          setUserNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [username]);

  const toggleSubscribe = async () => {
    try {
      await axios.post("/api/toggle-subscribe", {
        channelOwnerId: data.ownerId,
        unSubscribe: data.isSubcribed,
      });

      setData((prev) => ({
        ...prev,
        isSubcribed: !prev.isSubcribed,
        subscribers: prev.subscribers + (prev.isSubcribed ? -1 : 1),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (userNotFound) {
    return <h1>User Not Found</h1>;
  }
  if (!data) {
    return null;
  }
  return (
    <div className="max-w-6xl mx-auto">
      {/* Cover Image */}
      <div className="w-full h-40 sm:h-56 bg-gray-300 overflow-hidden">
        <img
          src={data.coverImage}
          className="w-full h-full object-cover"
          alt="cover"
        />
      </div>

      {/* Channel Info */}
      <div className="px-4 mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <img
            src={data.avatar}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            alt="avatar"
          />

          <div>
            <h2 className="text-lg sm:text-xl font-semibold capitalize">
              {data.fullName}
            </h2>
            <p className="text-gray-600 text-sm">@{data.username}</p>
            <p className="text-sm text-gray-500">
              {data.subscribers} subscribers
            </p>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={toggleSubscribe}
          className={`w-full sm:w-auto px-6 py-2 rounded-full text-sm font-medium ${
            data.isSubcribed ? "bg-gray-200 text-black" : "bg-black text-white"
          }`}
        >
          {data.isSubcribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Videos */}
      <div className="px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.userVideo.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet</p>
        ) : (
          data.userVideo.map((v) => (
            <div
              key={v._id}
              onClick={() => router.push(`/v/watch/${v._id}`)}
              className="cursor-pointer"
            >
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={v.thumbnail}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>

              <h4 className="mt-2 text-sm font-medium line-clamp-2">
                {v.title}
              </h4>
              <p className="text-xs text-gray-500">{v.views} views</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
