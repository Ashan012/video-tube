import { dbconnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/models/users.model";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import VideoModel from "@/models/vidoes.model";
import mongoose from "mongoose";

export async function GET() {
  await dbconnect();
  try {
    const session = await getServerSession(authOptions);
    const userId = session._id;

    if (!userId) {
      throw new ApiError("user not found", 404);
    }
    const watchHistory = await UserModel.findOne({ _id: userId })

      .select({ watchHistory: { $slice: -10 } })
      .populate({
        path: "watchHistory",
        select: "title description thumbnail ",
      })
      .lean();

    if (!watchHistory) {
      throw new ApiError("failed to watchHistory", 500);
    }

    return NextResponse.json(
      new ApiResponse(
        true,
        "fetch watchHistory successfully",
        200,
        watchHistory
      )
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
