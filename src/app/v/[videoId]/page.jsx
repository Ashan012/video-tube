"use client";

import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function SingleVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState([]);
  const [content, setContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const { videoId } = useParams();

  useEffect(() => {
    if (!videoId) return;

    const findVideoById = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/get-video-by-id?videoId=${videoId}`);
        const commentRes = await axios.get(
          `/api/get-video-comments?videoId=${videoId}`
        );
        if (res) {
          console.log(res.data.data);
          setVideo(res.data.data);
        }
        if (commentRes) {
          setComment(commentRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    findVideoById();
  }, []);

  const addComment = async () => {
    setCommentLoading(true);
    try {
      const res = await axios.post(`/api/add-comment`, {
        content,
        videoId,
      });
      if (res) {
        console.log(res);
        setComment((prev) => [res.data.data, ...prev]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setContent("");
      setCommentLoading(false);
    }
  };

  const toggleSubscribe = async (channelOwnerId, unSubscribe) => {
    try {
      const res = await axios.post("/api/toggle-subscribe", {
        channelOwnerId,
        unSubscribe,
      });
      if (res) {
        console.log(res);
        setSubscribe(!unSubscribe);
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading video...
      </div>
    );
  }

  if (!video) return null;

  return (
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

        {/* Channel Info */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3">
            <img
              src={video.owner.avatar}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-medium leading-tight">
                {video.owner.fullName}
              </p>
              <p className="text-xs text-gray-500">12.4K subscribers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <button className="flex items-center gap-1 px-4 py-2 hover:bg-gray-200">
                <ThumbsUp size={18} />
                <span className="text-sm">12K</span>
              </button>

              <div className="w-px bg-gray-300 h-6" />

              <button className="px-4 py-2 hover:bg-gray-200">
                <ThumbsDown size={18} />
              </button>
            </div>

            {subscribe ? (
              <button
                onClick={() => toggleSubscribe(video.owner._id, true)}
                className="ml-3 bg-gray-200 px-5 py-2 rounded-full text-sm font-medium"
              >
                Subscribed
              </button>
            ) : (
              <button
                onClick={() => toggleSubscribe(video.owner._id, false)}
                className="ml-3 bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="mt-4 bg-gray-100 rounded p-3 text-sm">
          <div>
            <p className="text-sm text-gray-600 mt-1">
              {video.views} views •
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          {video.description}
        </div>
      </div>
      {/* Comments */}
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
              className="w-full border-b outline-none py-2 text-sm"
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

        <div className="space-y-5">
          {comment.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img
                src={c.owner.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-medium">{c.owner.fullName}</p>

                <p className="text-sm mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SingleVideoPage;
