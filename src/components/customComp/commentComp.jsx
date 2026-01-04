"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Commentcomp({ comments, videoId, setReaction }) {
  const [loading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const addComment = async () => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(`/api/add-comment`, { content, videoId });
      if (res) console.log(res.data);
      setReaction((prev) => ({
        ...prev,
        comment: [res.data.data, ...prev.comment],
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setContent("");
    }
  };

  if (!comments) return null;
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">{comments.length} Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-3 items-start mb-6">
        {/* <img
            src={}
          className="w-10 h-10 rounded-full object-cover"
        /> */}
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
          {comments.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <img
                src={c.ownerAvatar ?? c.owner?.avatar}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-medium">
                  {c.ownerFullName ?? c.owner?.fullName}
                </p>
                <p className="text-sm mt-1">{c.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
