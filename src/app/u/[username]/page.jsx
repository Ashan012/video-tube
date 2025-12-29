"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function getUserProfile() {
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const getProfile = async () => {
      setIsSubmitting(true);
      try {
        const response = await axios.get(
          `/api/get-user-channel-profile${username}`
        );
        if (response) {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    };
    getProfile();
  }, []);
  return isSubmitting ? <p>loading....</p> : <p>user profile</p>;
}

export default getUserProfile;
