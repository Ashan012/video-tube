"use client";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp, Unlink } from "lucide-react";

function LikeandSubscribeSec({ videoId, reaction, setReaction }) {
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

  const toggleLikeVideo = async (unLike) => {
    try {
      const res = await axios.post(`/api/video-like`, { videoId, unLike });
      if (res) {
        setReaction((prev) => ({
          ...prev,
          isLiked: !unLike,
          likeCount: prev.likeCount + (unLike ? -1 : 1),
        }));
        if (reaction.isDislike && !unLike) {
          setReaction((prev) => ({
            ...prev,
            isDislike: false,
            disLikeCount: prev.disLikeCount + (disLikeCount - 1),
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDislikeVideo = async (unLike) => {
    try {
      const res = await axios.post(`/api/dislike-video`, { videoId, unLike });
      if (res) {
        setReaction((prev) => ({
          ...prev,
          isDislike: !unLike,
          disLikeCount: prev.disLikeCount + (unLike ? -1 : 1),
        }));
        if (reaction.isLiked && !unLike) {
          setReaction((prev) => ({
            ...prev,
            isDislike: false,
            disLikeCount: prev.disLikeCount - 1,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!reaction) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <motion.button
          disabled={reaction.isDislike}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleLikeVideo(reaction.isLiked)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full ${
            reaction.isLiked
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <ThumbsUp size={18} /> {reaction.likeCount}
        </motion.button>

        <motion.button
          disabled={reaction.isLiked}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleDislikeVideo(reaction.isDislike)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full  ${
            reaction.isDislike
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <ThumbsDown size={18} /> {reaction.disLikeCount}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleSubscribe(reaction.owner, reaction.isSubscribed)}
          className={`px-5 py-2 rounded-full text-sm font-medium ${
            reaction.isSubscribed ? "bg-gray-200" : "bg-black text-white"
          }`}
        >
          {reaction.isSubscribed ? "Subscribed" : "Subscribe"}
        </motion.button>
      </div>
    </>
  );
}

export default LikeandSubscribeSec;
