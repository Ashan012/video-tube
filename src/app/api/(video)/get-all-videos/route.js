import { dbconnect } from "@/lib/dbconnect";
import UserModel from "@/models/users.model";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET() {
  await dbconnect();
  try {
    const allVideo = await VideoModel.find({ isPublished: true })
      .select("-videoFile")
      .populate("owner", "avatar fullName username")
      .sort({ createdAt: -1 })
      .lean();

    if (!allVideo) {
      throw new ApiError("cannot fetch all video", 500);
    }
    return NextResponse.json(
      new ApiResponse(true, "get video successfully", 200, allVideo),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error?.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "error on get All videos",
        status: error?.status || 500,
      },
      {
        status: error?.status || 500,
      }
    );
  }
}
