"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function GetAllvideos() {
  const [video, setVideo] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await axios.get(`/api/get-all-videos`);
        if (response) {
          setVideo(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        console.log(video);
      }
    };
    getAllVideos();
  }, []);

  const getVideoById = async (videoId) => {
    console.log(videoId);
    router.replace(`/v/${videoId}`);
  };
  return (
    <div>
      {video.map((c, i) => (
        <div key={i} className="w-20 h-20" onClick={() => getVideoById(c._id)}>
          <img src={c.thumbnail} className="object-fill" />
          <p>{c.title}</p>
        </div>
      ))}
    </div>
  );
}

export default GetAllvideos;
