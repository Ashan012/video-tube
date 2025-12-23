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

    const tweetId = searchParams.get("tweetId");
    if (!isValidObjectId(tweetId)) {
      throw new ApiError("twwet id is invalid");
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new ApiError("user not authorize", 404);
    }
    const userId = session._id;

    const likeTweet = await likeModel.create({
      tweet: tweetId,
      likedBy: userId,
    });

    if (!likeTweet) {
      throw new ApiError("Error on tweet like ", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "tweet like successfully", 200, likeTweet),
      {
        staus: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on twwet like route ",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
