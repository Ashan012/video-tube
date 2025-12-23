import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import likeModel from "@/models/like.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { dbconnect } from "@/lib/dbconnect";

export async function POST(req) {
  dbconnect();
  try {
    const { searchParams } = new URL(req.url);

    const videoId = searchParams.get("videoId");
    if (!isValidObjectId(videoId)) {
      throw new ApiError("video id is invalid");
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user not authorize", 404);
    }
    const userId = session._id;

    const likeVideo = await likeModel.create({
      video: videoId,
      likedBy: userId,
    });

    if (!likeVideo) {
      throw new ApiError("Error on like video ", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "like video successfully", 200, likeVideo),
      {
        staus: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on video like route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
