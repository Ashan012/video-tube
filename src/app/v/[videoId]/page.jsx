"use client";

import NavBar from "@/components/customComp/navBar";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SingleVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState([]);
  const [content, setContent] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislike, setDislike] = useState(false);
  const [disLikeCount, setdisLikeCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const { videoId } = useParams();

  // Fetch Video + Comments
  useEffect(() => {
    if (!videoId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/get-video-by-id?videoId=${videoId}`);
        const commentRes = await axios.get(
          `/api/get-video-comments?videoId=${videoId}`
        );
        if (res) setVideo(res.data.data);
        if (commentRes) setComment(commentRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Video Details (like/subscriber)
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `/api/get-user-video-details?videoId=${videoId}`
        );
        if (res) {
          setSubscribe(res.data.data.isSubcribed);
          setSubscriberCount(res.data.data.subcribedChannel);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, []);

  // Fetch Likes/Dislikes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axios.get(
          `/api/all-like-dislike-video?videoId=${videoId}`
        );
        if (res.data.data.currentUserLike) setLike(true);
        if (res.data.data.currentUserdisLike) setDislike(true);
        setLikeCount(res.data.data.videoLikes);
        setdisLikeCount(res.data.data.disLikevideos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLikes();
  }, []);

  const addComment = async () => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(`/api/add-comment`, { content, videoId });
      if (res) setComment((prev) => [res.data.data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setContent("");
    }
  };

  const toggleSubscribe = async (channelOwnerId, unSubscribe) => {
    try {
      const res = await axios.post("/api/toggle-subscribe", {
        channelOwnerId,
        unSubscribe,
      });
      if (res) {
        setSubscribe(!unSubscribe);
        setSubscriberCount(subscriberCount + (unSubscribe ? -1 : 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLikeVideo = async (unLike) => {
    try {
      const res = await axios.post(`/api/video-like`, { videoId, unLike });
      if (res) {
        setLike(!unLike);
        setLikeCount(likeCount + (unLike ? -1 : 1));
        if (dislike && !unLike) {
          setDislike(false);
          setdisLikeCount(disLikeCount - 1);
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
        setDislike(!unLike);
        setdisLikeCount(disLikeCount + (unLike ? -1 : 1));
        if (like && !unLike) {
          setLike(false);
          setLikeCount(likeCount - 1);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading video...
      </div>
    );
  if (!video) return null;

  return (
    <>
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Video Player */}
        <div className="w-full bg-black rounded overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full max-h-[500px]"
          />
        </div>

        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl font-semibold">{video.title}</h1>

          {/* Channel Info + Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
            <div className="flex items-center gap-3">
              <img
                src={video.owner.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium leading-tight">
                  {video.owner.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {subscriberCount} subscribers
                </p>
              </div>
            </div>

            {/* Like / Dislike / Subscribe Buttons */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLikeVideo(like)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full ${
                  like
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <ThumbsUp size={18} /> {likeCount}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleDislikeVideo(dislike)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full ${
                  dislike
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <ThumbsDown size={18} /> {disLikeCount}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSubscribe(video.owner._id, subscribe)}
                className={`px-5 py-2 rounded-full text-sm font-medium ${
                  subscribe ? "bg-gray-200" : "bg-black text-white"
                }`}
              >
                {subscribe ? "Subscribed" : "Subscribe"}
              </motion.button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 bg-gray-100 rounded p-3 text-sm">
            <p className="text-sm text-gray-600 mt-1">
              {video.views} views •{" "}
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            {video.description}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            {comment.length} Comments
          </h2>

          {/* Add Comment */}
          <div className="flex gap-3 items-start mb-6">
            <img
              src={video.owner.avatar}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-b outline-none py-2 text-sm focus:border-black"
              />
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setContent("")}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={addComment}
                  disabled={!content.trim()}
                  className="text-sm bg-black text-white px-4 py-1 rounded disabled:opacity-40"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Display Comments */}
          <div className="space-y-4">
            <AnimatePresence>
              {comment.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3"
                >
                  <img
                    src={c.owner.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{c.owner.fullName}</p>
                    <p className="text-sm mt-1">{c.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleVideoPage;
