import { dbconnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import VideoModel from "@/models/vidoes.model";
import mongoose, { isValidObjectId } from "mongoose";

export async function DELETE(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const historyId = searchParams.get("historyid");
    console.log(historyId);
    if (!isValidObjectId(historyId)) {
      throw new ApiError("is not valid id", 404);
    }
    const session = await getServerSession(authOptions);
    const userId = session._id;

    if (!userId) {
      throw new ApiError("user not found", 404);
    }

    const deleteWatchHistory = await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        watchHistory: new mongoose.Types.ObjectId(historyId),
      },
    });

    if (!deleteWatchHistory) {
      throw new ApiError("failed to watchHistory", 500);
    }

    return NextResponse.json(
      new ApiResponse(true, "delete watchHistory successfully", 200)
    );
  } catch (error) {
    console.error(error?.message || error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on watch History fetching",
        status: error?.status || 400,
      },
      {
        status: error?.status || 400,
      }
    );
  }
}
