"use client";
import axios from "axios";
import React from "react";
import { signIn } from "next-auth/react";

function page() {
  const handleSubmit = async () => {
    console.log("they work");
    const response = signIn("credentials", {
      redirect: false,
      username: "habib122",
      password: "123456789",
    });
    if (response) {
      console.log((await response).url);
    } else {
      console.log((await response).error);
    }
  };
  return (
    <div>
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
}

export default page;
