import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import likeModel from "@/models/like.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { dbconnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";

export async function GET(req) {
  dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    if (!isValidObjectId(videoId)) {
      throw new ApiError("video id is invalid");
    }
    const session = await getServerSession(authOptions);
    const userId = session._id;

    const videoLikes = await likeModel.countDocuments({
      video: videoId,
    });
    const currentUserLike = await likeModel.exists({
      video: videoId,
      likedBy: userId,
    });

    const disLikevideos = await likeModel.countDocuments({
      disLikeVideo: videoId,
    });
    const currentUserdisLike = await likeModel.exists({
      disLikeVideo: videoId,
      likedBy: userId,
    });

    return NextResponse.json(
      new ApiResponse(true, "all like video successfully", 200, {
        videoLikes,
        currentUserLike,
        disLikevideos,
        currentUserdisLike,
      }),

      {
        staus: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get like video route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
