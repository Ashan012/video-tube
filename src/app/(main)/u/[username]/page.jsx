"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function getUserProfile() {
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    username: "",
    avatar: "",
    coverImage: "",
    subcribedChannel: 0,
    isSubcribed: false,
    userVideo: [],
  });
  useEffect(() => {
    const getProfile = async () => {
      setIsSubmitting(true);
      try {
        const response = await axios.get(
          `/api/get-user-channel-profile${username}`
        );
        if (response.data) {
          const data = response.data.data;
          setData({
            fullName: data.fullName,
            username: data.username,
            avatar: data.avatar,
            coverImage: data.coverImage,
            subcribedChannel: data.subcribedChannel,
            isSubcribed: data.isSubcribed,
            userVideo: data.userVideo,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };
    getProfile();
  }, []);
  const toggleSubscribe = async (channelOwnerId, unSubscribe) => {
    try {
      const res = await axios.post("/api/toggle-subscribe", {
        channelOwnerId,
        unSubscribe,
      });
      if (res) {
        console.log(res);
        setReaction((prev) => ({
          ...prev,
          isSubscribed: !unSubscribe,
          subscriber: prev.subscriber + (unSubscribe ? -1 : 1),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return null;
  return isSubmitting ? (
    <p>loading....</p>
  ) : (
    <div>
      <div>
        <div>
          <img src={data.coverImage} alt="coverImage" />
        </div>
        <div>
          <img src={data.avatar} alt="avatar" />
          <p>Subscribers {data.subcribedChannel}</p>
        </div>

        <button
          onClick={() => toggleSubscribe(reaction.owner, reaction.isSubscribed)}
          className={`px-5 py-2 rounded-full text-sm font-medium ${
            data.isSubcribed ? "bg-gray-200" : "bg-black text-white"
          }`}
        >
          {data.isSubcribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <div>
        {data.userVideo.map((c, i) => (
          <div key={i}>
            <div
              key={c._id}
              onClick={() => router.push(`/v/watch/${c._id}`)}
              className="cursor-pointer"
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
                <img src={c.thumbnail} className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-3 mt-3">
                <img
                  src={data.avatar}
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div className="text-sm">
                  <h4 className="font-medium line-clamp-2">{c.title}</h4>
                  <p className="text-gray-600">{data.fullName}</p>
                  <p className="text-gray-500 text-xs">
                    {c.views} views • 44 minutes ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default getUserProfile;
