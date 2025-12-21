import { dbconnect } from "@/lib/dbconnect";
import VideoModel from "@/models/vidoes.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { isValidObjectId } from "mongoose";

export async function GET(req) {
  await dbconnect();
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!isValidObjectId(videoId)) {
      throw new ApiError("is not valid id", 401);
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      throw new ApiError("cannot fetch video", 500);
    }
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
