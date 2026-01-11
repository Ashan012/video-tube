"use client";

import NavBar from "@/components/customComp/navBar";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Commentcomp from "@/components/customComp/commentComp";
import LikeandSubscribeSec from "@/components/customComp/LikeandSubscribeSec";

function SingleVideoPage() {
  const router = useRouter();
  const [reaction, setReaction] = useState({
    title: "",
    description: "",
    videoFile: "",
    views: 0,
    owner: "",
    isLiked: false,
    isDislike: false,
    isSubscribed: false,
    subscriber: 0,
    likeCount: 0,
    disLikeCount: 0,
    comment: [],
    avatar: "",
    fullName: "",
    username: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { videoId } = useParams();

  // Fetch Video + Comments
  useEffect(() => {
    if (!videoId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/get-video-details?videoId=${videoId}`
        );

        if (res) {
          const data = res.data.data;

          console.log("res.data.data===>", data);
          setReaction({
            title: data.title,
            description: data.description,
            videoFile: data.videoFile,
            views: data.views,
            isLiked: data.isLiked,
            isDislike: data.isDisLike,
            isSubscribed: data.isSubcribed,
            subscriber: data.subcribedChannel,
            likeCount: data.videoLikesCount,
            disLikeCount: data.videoDisLikesCount,
            comment: data.videoComments,
            avatar: data.ownerAvatar,
            fullName: data.ownerFullName,
            username: data.ownerUsername,
            createdAt: data.createdAt,
            owner: data.owner,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading video...
      </div>
    );
  if (!reaction) return null;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Video Player */}
        <div className="w-full bg-black rounded overflow-hidden">
          <video
            src={reaction.videoFile || null}
            controls
            autoPlay
            className="w-full max-h-125"
          />
        </div>
        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl font-semibold">{reaction.title}</h1>

          {/* Channel Info + Actions */}
          <div
            title="Profile"
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4"
          >
            <div
              onClick={() => router.push(`/u/${reaction.username} `)}
              className="flex items-center gap-3 "
            >
              <img
                src={reaction.avatar || null}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium leading-tight">{reaction.fullName}</p>
                <p className="text-xs text-gray-500">
                  {reaction.subscriber || 0} subscribers
                </p>
              </div>
            </div>

            {/* Like / Dislike / Subscribe Buttons */}
            <LikeandSubscribeSec
              videoId={videoId}
              reaction={reaction}
              setReaction={setReaction}
            />
          </div>

          {/* Description */}
          <div className="mt-4 bg-gray-100 rounded p-3 text-sm">
            <p className="text-sm text-gray-600 mt-1">
              {reaction.views} views •
              {new Date(reaction.createdAt || 0).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            {reaction.description}
          </div>
        </div>
        {/* Comments Section */}
        {isLoading ? (
          "loading.."
        ) : (
          <Commentcomp
            comments={reaction.comment}
            videoId={videoId}
            setReaction={setReaction}
          />
        )}
      </div>
    </>
  );
}

export default SingleVideoPage;
