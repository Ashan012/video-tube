import { dbconnect } from "@/lib/dbconnect";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(user)/auth/[...nextauth]/option";
import UserModel from "@/models/users.model";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    console.log("videoId===>", videoId);
    if (!isValidObjectId(videoId)) {
      throw new ApiError("is not valid id", 401);
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError("use was not authorize", 404);
    }
    const userId = session._id;

    const video = await VideoModel.findOneAndUpdate(
      { _id: videoId, isPublished: true },

      {
        $inc: { views: 1 },
      },
      { new: true }
    )
      .populate("owner", "avatar fullName")
      .lean();

    if (!video) {
      throw new ApiError("cannot fetch video", 500);
    }

    const userWatchHistory = await UserModel.findByIdAndUpdate(userId, {
      $push: {
        watchHistory: {
          $each: [videoId],
        },
      },
    });
    return NextResponse.json(
      new ApiResponse(true, "get video successfully", 200, video),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get video by id",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
