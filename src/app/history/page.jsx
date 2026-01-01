"use client";

import axios from "axios";
import React, { useEffect } from "react";

function page() {
  useEffect(() => {
    const getWatchHistory = async () => {
      try {
        const res = await axios.get("/api/user-watch-history");
        if (res) {
          console.log(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getWatchHistory();
  }, []);

  return <div>History</div>;
}

export default page;
